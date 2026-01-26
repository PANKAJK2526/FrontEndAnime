'use client'

type Flavour = {
  name: string
  note: string
}

export default function FlavourOverlay({ flavour }: { flavour: Flavour }) {
  return (
    <div
      className="
        absolute
        inset-x-0
        bottom-[4vh]
        z-20
        flex
        justify-center
        text-center
        flavour-enter
      "
    >
      <div className="inline-block">
        <p className="text-sm tracking-widest opacity-70">
          PURE, HONEST AND DAMN DELICIOUS
        </p>

        <h2 className="mt-2 text-4xl font-bold">
          {flavour.name}
        </h2>

        <p className="mt-1 text-xs tracking-wide opacity-60">
          {flavour.note}
        </p>
      </div>
    </div>
  )
}
