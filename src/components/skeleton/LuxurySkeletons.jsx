function Line({ width = "100%", height = 14, className = "" }) {
  return <span className={`luxury-skeleton-line ${className}`.trim()} style={{ width, height }} aria-hidden="true" />;
}

export function CatalogoSkeleton({ cantidad = 6 }) {
  return (
    <div className="catalogo-skeleton" aria-hidden="true">
      <div className="skeleton-resultados mb-4">
        <Line width="210px" height={16} />
        <Line width="170px" height={16} />
      </div>
      <div className="row g-4 catalogo-grid">
        {Array.from({ length: cantidad }).map((_, index) => (
          <div className="col-12 col-md-6 col-lg-4" key={index}>
            <article className="card luxury-card h-100 border-0 tarjeta-producto-uniforme luxury-skeleton-card">
              <div className="luxury-skeleton-badges">
                <Line width="72px" height={18} />
                <Line width="68px" height={18} />
              </div>
              <div className="card-img-wrapper luxury-skeleton-media">
                <div className="luxury-skeleton-frame luxury-skeleton-product-image" />
              </div>
              <div className="card-body p-4 d-flex flex-column justify-content-between gap-3">
                <div>
                  <Line width="88px" height={11} className="mb-2" />
                  <Line width="120px" height={11} className="mb-2" />
                  <Line width="78%" height={28} className="mb-2" />
                  <div className="d-flex flex-wrap gap-2 mt-3">
                    <Line width="68px" height={22} />
                    <Line width="74px" height={22} />
                  </div>
                </div>
                <div>
                  <Line width="95px" height={22} className="mb-3 mx-auto" />
                  <Line width="100%" height={40} className="mb-2" />
                  <Line width="100%" height={40} />
                </div>
              </div>
            </article>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DetalleProductoSkeleton() {
  return (
    <div className="detalle-skeleton" aria-hidden="true">
      <div className="container py-4">
        <Line width="220px" height={13} className="mb-4" />
      </div>
      <section className="detalle-skeleton-hero">
        <div className="container">
          <div className="row g-4 align-items-stretch">
            <div className="col-12 col-lg-5">
              <div className="luxury-skeleton-panel luxury-skeleton-hero-media">
                <div className="luxury-skeleton-frame luxury-skeleton-bottle" />
              </div>
            </div>
            <div className="col-12 col-lg-7">
              <div className="luxury-skeleton-panel h-100 p-4 p-lg-5">
                <Line width="115px" height={12} className="mb-3" />
                <Line width="72%" height={46} className="mb-3" />
                <Line width="45%" height={16} className="mb-2" />
                <Line width="100%" height={14} className="mb-2" />
                <Line width="92%" height={14} className="mb-2" />
                <Line width="84%" height={14} className="mb-4" />
                <div className="row g-2 mb-4">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div className="col-6 col-sm-3" key={index}><Line width="100%" height={62} /></div>
                  ))}
                </div>
                <div className="d-flex flex-wrap gap-3">
                  <Line width="180px" height={46} />
                  <Line width="180px" height={46} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="container py-5">
        <div className="row g-4">
          <div className="col-12 col-xl-7">
            <div className="luxury-skeleton-panel p-4 p-lg-5 h-100">
              <Line width="170px" height={14} className="mb-3" />
              <Line width="280px" height={28} className="mb-4" />
              <div className="row g-3 mb-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div className="col-md-4" key={index}><Line width="100%" height={140} /></div>
                ))}
              </div>
              <Line width="100%" height={14} className="mb-2" />
              <Line width="96%" height={14} className="mb-2" />
              <Line width="88%" height={14} />
            </div>
          </div>
          <div className="col-12 col-xl-5">
            <div className="luxury-skeleton-panel p-4 h-100">
              <Line width="150px" height={14} className="mb-3" />
              <Line width="70%" height={26} className="mb-3" />
              {Array.from({ length: 4 }).map((_, index) => <Line key={index} width="100%" height={13} className="mb-2" />)}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export function HomeSectionSkeleton({ title = "Cargando", cards = 3 }) {
  return (
    <section className="py-5 vh-section">
      <div className="container" aria-hidden="true">
        <div className="text-center mb-4">
          <Line width="120px" height={12} className="mx-auto mb-3" />
          <Line width="280px" height={32} className="mx-auto" />
        </div>
        <div className="row g-4">
          {Array.from({ length: cards }).map((_, index) => (
            <div className={cards === 1 ? "col-12" : cards === 2 ? "col-12 col-lg-6" : cards >= 4 ? "col-12 col-md-6 col-xl-3" : "col-12 col-md-6 col-lg-4"} key={`${title}-${index}`}>
              <div className="luxury-skeleton-panel p-4 h-100">
                <Line width="100%" height={220} className="mb-3" />
                <Line width="110px" height={12} className="mb-2" />
                <Line width="68%" height={28} className="mb-2" />
                <Line width="90%" height={14} className="mb-2" />
                <Line width="62%" height={14} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AdminStatsSkeleton({ cantidad = 4 }) {
  return (
    <div className="row g-3 mb-4" aria-hidden="true">
      {Array.from({ length: cantidad }).map((_, index) => (
        <div className="col-12 col-sm-6 col-xl-3" key={index}>
          <div className="admin-stat-card luxury-skeleton-panel">
            <Line width="56px" height={11} className="mb-3" />
            <Line width="90px" height={28} className="mb-2" />
            <Line width="130px" height={11} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function AdminTableSkeleton({ filas = 5, columnas = 5, showFilters = true }) {
  return (
    <div className="admin-panel" aria-hidden="true">
      {showFilters && (
        <div className="row g-3 mb-4">
          <div className="col-md-8"><Line width="100%" height={44} /></div>
          <div className="col-md-4"><Line width="100%" height={44} /></div>
        </div>
      )}
      <div className="table-responsive luxury-skeleton-table-wrap">
        <table className="table admin-table align-middle mb-0 luxury-skeleton-table">
          <thead>
            <tr>{Array.from({ length: columnas }).map((_, index) => <th key={index}><Line width="75%" height={12} /></th>)}</tr>
          </thead>
          <tbody>
            {Array.from({ length: filas }).map((_, rowIndex) => (
              <tr key={rowIndex}>{Array.from({ length: columnas }).map((_, columnIndex) => <td key={columnIndex}><Line width={columnIndex === 0 ? "82%" : "64%"} height={14} /></td>)}</tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
