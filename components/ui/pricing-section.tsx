"use client"

import { cn } from "@/lib/utils"

export interface Feature {
    name: string
    included: boolean
}

export interface PricingTier {
    name: string
    price: {
        monthly: number
        yearly: number
    }
    features: Feature[]
    highlight?: boolean
    badge?: string
    buttonText: string
    loading?: boolean
    onAction: () => void
    secondaryAction?: React.ReactNode
}

export interface PricingSectionProps {
    title?: string
    subtitle?: string
    tiers: PricingTier[]
    className?: string
    hideToggle?: boolean
}

function PricingSection({ tiers, className, title, subtitle }: PricingSectionProps) {
    return (
        <section className={cn("relative py-12 md:py-24", className)}>
            <div className="mx-auto w-full max-w-5xl px-6">

                {/* Header */}
                <div className="mb-16 flex flex-col items-center gap-4 text-center">
                    {title && (
                        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl" style={{ fontFamily: 'var(--font-display)' }}>
                            {title}
                        </h2>
                    )}
                    {subtitle && (
                        <p className="max-w-xl text-base text-zinc-500">
                            {subtitle}
                        </p>
                    )}
                </div>

                {/* Grid */}
                <div className="mx-auto grid max-w-lg grid-cols-1 items-stretch gap-8 lg:max-w-none lg:grid-cols-3">
                    {tiers.map((tier, i) => (
                        <div
                            key={tier.name}
                            className={cn(
                                "relative flex flex-col rounded-3xl bg-white p-8",
                                tier.highlight
                                    ? "border-2 border-zinc-900 shadow-xl"
                                    : "border border-zinc-200 shadow-sm"
                            )}
                        >
                            {/* Outstanding Badge */}
                            {tier.badge && tier.highlight && (
                                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-zinc-900 px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-sm" style={{ whiteSpace: 'nowrap' }}>
                                    {tier.badge}
                                </div>
                            )}

                            {/* Plan Name & Price */}
                            <div className="mb-8 text-center">
                                <h3 className="mb-4 text-lg font-medium text-zinc-600">
                                    {tier.name}
                                </h3>
                                <div className="flex items-baseline justify-center gap-1.5" style={{ fontFamily: 'var(--font-display)' }}>
                                    <span className="text-4xl font-bold text-zinc-900 tracking-tight">
                                        ${tier.price.monthly.toLocaleString("es-AR")}
                                    </span>
                                    <span className="text-sm font-medium text-zinc-500">/mes</span>
                                </div>
                            </div>

                            {/* Features */}
                            <ul className="mb-10 flex-1 space-y-4">
                                {tier.features.map((feature, j) => (
                                    <li key={j} className="flex items-start gap-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mt-[3px] h-4 w-4 shrink-0 text-zinc-900">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                        <span className="text-[14px] leading-relaxed text-zinc-600">
                                            {feature.name}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            {/* Action Buttons */}
                            <div className="mt-auto flex flex-col gap-4">
                                <button
                                    onClick={tier.onAction}
                                    disabled={tier.loading}
                                    className={cn(
                                        "flex h-[48px] w-full items-center justify-center rounded-xl text-[15px] font-medium transition-colors disabled:opacity-50",
                                        tier.highlight
                                            ? "bg-zinc-900 text-white hover:bg-zinc-800"
                                            : "border border-zinc-200 bg-white text-zinc-900 hover:border-zinc-300 hover:bg-zinc-50"
                                    )}
                                    style={{ color: tier.highlight ? 'white' : 'inherit' }}
                                >
                                    {tier.loading ? "Procesando..." : tier.buttonText}
                                </button>

                                {tier.secondaryAction && (
                                    <div className="mt-1 flex justify-center">
                                        {tier.secondaryAction}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export { PricingSection }
