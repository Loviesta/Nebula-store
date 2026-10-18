import SectionHeading from '../ui/SectionHeading'

const categories = [
  {
    name: 'T-Shirts',
    number: '01',
    image:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=85',
  },
  {
    name: 'Hoodies',
    number: '02',
    image:
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=700&q=85',
  },
  {
    name: 'Pants',
    number: '03',
    image:
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=700&q=85',
  },
  {
    name: 'Outerwear',
    number: '04',
    image:
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=700&q=85',
  },
]

const Categories = () => {
  return (
    <section id="collections" className="bg-white px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Find Your Style"
          title="Shop by Category."
          description="From everyday essentials to statement pieces, discover the collection that speaks your language."
        />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
          {categories.map((category) => (
            <a
              key={category.name}
              href="#shop"
              className="group relative overflow-hidden bg-neutral-100"
            >
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/5 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4 sm:p-6">
                <div>
                  <p className="mb-2 text-[10px] font-bold tracking-widest text-orange-400">
                    COLLECTION {category.number}
                  </p>

                  <h3 className="text-lg font-extrabold text-white sm:text-2xl">
                    {category.name}
                  </h3>
                </div>

                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/50 text-sm text-white transition group-hover:border-orange-500 group-hover:bg-orange-500">
                  ↗
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Categories