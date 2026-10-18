const SectionHeading = ({
  eyebrow,
  title,
  description,
  dark = false,
}) => {
  return (
    <div className="mb-10 flex flex-col gap-4 sm:mb-12 md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow && (
          <p
            className={`mb-3 text-xs font-extrabold uppercase tracking-[0.25em] ${
              dark ? 'text-orange-400' : 'text-orange-500'
            }`}
          >
            {eyebrow}
          </p>
        )}

        <h2
          className={`text-3xl font-extrabold tracking-[-0.05em] sm:text-4xl lg:text-5xl ${
            dark ? 'text-white' : 'text-neutral-950'
          }`}
        >
          {title}
        </h2>
      </div>

      {description && (
        <p
          className={`max-w-md text-sm leading-7 ${
            dark ? 'text-neutral-400' : 'text-neutral-500'
          }`}
        >
          {description}
        </p>
      )}
    </div>
  )
}

export default SectionHeading