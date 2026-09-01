import Image from 'next/image';
import { ReactNode } from 'react';
import { Container } from '@/components/layout/container';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils/cn';

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
  image?: string;
  imageAlt?: string;
  imagePosition?: string;
};

export function PageHero({
  eyebrow,
  title,
  description,
  actions,
  image,
  imageAlt = '',
  imagePosition = 'center',
}: PageHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-black/5 bg-white">
      <div className="pointer-events-none absolute inset-0 bg-hero-glow" aria-hidden="true" />
      <Container className="relative py-14 sm:py-16 lg:py-20">
        <div
          className={cn(
            image
              ? 'grid items-center gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16'
              : 'mx-auto max-w-4xl text-center'
          )}
        >
          <div className={cn(image ? 'max-w-2xl' : '')}>
            <Badge>{eyebrow}</Badge>
            <h1 className="mt-6 text-4xl leading-[1.03] sm:text-5xl md:text-6xl">{title}</h1>
            <p className={cn('mt-6 max-w-2xl text-lg', image ? '' : 'mx-auto')}>{description}</p>
            {actions ? (
              <div className={cn('mt-8 flex flex-wrap gap-3', image ? '' : 'justify-center')}>{actions}</div>
            ) : null}
          </div>

          {image ? (
            <div className="relative min-h-[22rem] overflow-hidden rounded-[2rem] bg-fraternity-parchment shadow-[0_24px_70px_rgba(0,79,135,0.18)] sm:min-h-[28rem]">
              <Image
                src={image}
                alt={imageAlt}
                fill
                priority
                sizes="(min-width: 1024px) 52vw, 100vw"
                className="object-cover"
                style={{ objectPosition: imagePosition }}
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-fraternity-charcoal/20 via-transparent to-transparent"
                aria-hidden="true"
              />
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
