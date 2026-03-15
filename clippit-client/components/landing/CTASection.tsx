import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-24 md:py-40">
      <div className="max-w-5xl mx-auto px-4">
        <div className="bg-primary/5 border border-primary/20 rounded-3xl p-8 md:p-12 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Your inspiration library is empty right now.
          </h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Every marketer, copywriter, and founder has a mental backlog of things they found online and lost. Clippit fixes that.
          </p>
          <div className="flex flex-col items-center gap-6">
            <Link
              href="/sign-up"
              className="bg-primary text-primary-foreground rounded-full px-8 py-3 font-medium hover:opacity-90 transition-opacity inline-flex items-center gap-2 min-h-[44px] min-w-[200px] justify-center"
            >
              Get started
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/sign-in"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2 px-4 rounded min-h-[44px] flex items-center justify-center"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
