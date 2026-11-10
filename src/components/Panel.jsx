function Panel({ title, children }) {
  return (
    <section className="mb-[26px] rounded-[22px] bg-surface p-[22px] shadow-raised max-sm:px-3.5 max-sm:py-[18px]">
      <h2 className="mb-3.5 text-[17px] font-bold">{title}</h2>
      {children}
    </section>
  )
}

export default Panel
