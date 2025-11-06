interface PullQuoteProps {
  text: string;
  attribution?: string;
}

/**
 * PullQuote
 * Large, centered callout text to break up content
 * Creates visual pause and emphasizes key insights
 */
export default function PullQuote({ text, attribution }: PullQuoteProps) {
  return (
    <div className="my-16 md:my-20 py-12 md:py-16 border-y border-border">
      <blockquote className="max-w-4xl mx-auto text-center">
        <p className="text-3xl md:text-4xl lg:text-5xl font-light text-foreground leading-[1.3] tracking-tight-1 italic">
          &ldquo;{text}&rdquo;
        </p>
        {attribution && (
          <footer className="mt-6 md:mt-8 text-base md:text-lg text-muted-dark font-medium">
            — {attribution}
          </footer>
        )}
      </blockquote>
    </div>
  );
}

