import { fragmentShader } from '@/lib/shaders/interference'

/**
 * A raw WebGL renderer for the field.
 *
 * This replaced a react-three-fiber implementation. The field is one full-screen
 * triangle running one fragment shader — none of three.js's scene graph, camera,
 * material or loop machinery is doing any work here, and fighting r3f for
 * control of its render loop cost more than the library was worth:
 *
 *   - `advance()` under `frameloop="demand"` rendered a canvas that never
 *     composited; `invalidate()` on a throttled rAF did the same.
 *   - Its `useFrame` subscribers didn't tick at all until the first scroll
 *     event, so the first paint was always black.
 *   - `gl.setPixelRatio` and `setDpr` both raced its container measurement.
 *
 * All of that disappears when the loop, the sizing and the pixel ratio are ours.
 * It also drops ~600KB of three.js from a page whose entire 3D content is a
 * quad, which matters on the highest-intent page on the site.
 *
 * The fragment shader is unchanged from the Phasmatic port and still carries its
 * React Bits copyright notice; it only ever needed `v_uv` and its uniforms.
 */

/**
 * three.js silently prepends a preamble to every shader, including a default
 * float precision. Raw WebGL does not, and GLSL ES fragment shaders have no
 * default `float` precision — so a shader lifted straight out of three fails to
 * compile with an error about an undeclared precision qualifier. Prepending it
 * here keeps the shader source itself identical to the Phasmatic original.
 */
const PRECISION = `precision highp float;\nprecision highp int;\n`

const VERTEX = /* glsl */ `
attribute vec2 a_pos;
varying vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`

export interface FieldUniforms {
  aspect: number
  time: number
  hueShift: number
  noise: number
  scan: number
  scanFreq: number
  warp: number
  waveCount: number
  translateX: number
  translateY: number
  chromaAb: number
  pixelSize: number
  crtCurve: number
  mouseX: number
  mouseY: number
  poke: number
  intensity: number
}

const UNIFORM_NAMES = [
  'u_aspect', 'u_time', 'u_hueShift', 'u_noise', 'u_scan', 'u_scanFreq',
  'u_warp', 'u_waveCount', 'u_translate', 'u_chromaAb', 'u_pixelSize',
  'u_crtCurve', 'u_mouse', 'u_poke', 'u_intensity',
] as const

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)
  if (!shader) throw new Error('Could not create shader')

  gl.shaderSource(shader, source)
  gl.compileShader(shader)

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader)
    gl.deleteShader(shader)
    // Surfaced rather than swallowed: a silently failing shader is a black
    // rectangle with no explanation, which is a miserable thing to debug.
    throw new Error(`Field shader failed to compile: ${log}`)
  }

  return shader
}

export interface FieldRenderer {
  resize(cssWidth: number, cssHeight: number, dpr: number): void
  render(u: FieldUniforms): void
  destroy(): void
}

export function createFieldRenderer(canvas: HTMLCanvasElement): FieldRenderer | null {
  const gl = (canvas.getContext('webgl2', { antialias: false, alpha: false }) ??
    canvas.getContext('webgl', { antialias: false, alpha: false })) as WebGLRenderingContext | null

  if (!gl) return null

  const program = gl.createProgram()
  if (!program) return null

  const vs = compile(gl, gl.VERTEX_SHADER, VERTEX)
  const fs = compile(gl, gl.FRAGMENT_SHADER, PRECISION + fragmentShader)

  gl.attachShader(program, vs)
  gl.attachShader(program, fs)
  gl.linkProgram(program)

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(`Field program failed to link: ${gl.getProgramInfoLog(program)}`)
  }

  gl.deleteShader(vs)
  gl.deleteShader(fs)
  gl.useProgram(program)

  // One oversized triangle rather than two triangles for a quad: it covers the
  // viewport with three vertices and no seam down the diagonal.
  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)

  const aPos = gl.getAttribLocation(program, 'a_pos')
  gl.enableVertexAttribArray(aPos)
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

  const loc = {} as Record<(typeof UNIFORM_NAMES)[number], WebGLUniformLocation | null>
  for (const name of UNIFORM_NAMES) loc[name] = gl.getUniformLocation(program, name)

  return {
    resize(cssWidth, cssHeight, dpr) {
      const w = Math.max(1, Math.round(cssWidth * dpr))
      const h = Math.max(1, Math.round(cssHeight * dpr))
      if (canvas.width === w && canvas.height === h) return

      canvas.width = w
      canvas.height = h
      gl.viewport(0, 0, w, h)
    },

    render(u) {
      gl.uniform1f(loc.u_aspect, u.aspect)
      gl.uniform1f(loc.u_time, u.time)
      gl.uniform1f(loc.u_hueShift, u.hueShift)
      gl.uniform1f(loc.u_noise, u.noise)
      gl.uniform1f(loc.u_scan, u.scan)
      gl.uniform1f(loc.u_scanFreq, u.scanFreq)
      gl.uniform1f(loc.u_warp, u.warp)
      gl.uniform1f(loc.u_waveCount, u.waveCount)
      gl.uniform2f(loc.u_translate, u.translateX, u.translateY)
      gl.uniform1f(loc.u_chromaAb, u.chromaAb)
      gl.uniform1f(loc.u_pixelSize, u.pixelSize)
      gl.uniform1f(loc.u_crtCurve, u.crtCurve)
      gl.uniform2f(loc.u_mouse, u.mouseX, u.mouseY)
      gl.uniform1f(loc.u_poke, u.poke)
      gl.uniform1f(loc.u_intensity, u.intensity)

      gl.drawArrays(gl.TRIANGLES, 0, 3)
    },

    destroy() {
      gl.deleteBuffer(buffer)
      gl.deleteProgram(program)
      // Deliberately no WEBGL_lose_context here. A canvas only ever hands out
      // one context, so losing it makes the element permanently unusable — and
      // under React StrictMode, which mounts effects twice in development, the
      // second renderer would be built on the context the first one killed.
      // The symptom is a dead field in dev and a working one in production,
      // which is the worst possible place for the difference to show up.
    },
  }
}
