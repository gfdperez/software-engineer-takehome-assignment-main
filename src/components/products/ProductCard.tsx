// Example component demonstrating best practices

type ProductCardProps = {
  id: string
  name: string
  sku: string
  price: number
  description?: string | null
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

export default function ProductCard({
  id,
  name,
  sku,
  price,
  description,
  onEdit,
  onDelete,
}: ProductCardProps) {
  return (
    <div
      style={{
        border: '1px solid #ddd',
        padding: '1rem',
        borderRadius: '8px',
      }}
    >
      <h3 style={{ marginBottom: '0.5rem' }}>{name}</h3>
      <p style={{ color: '#666', fontSize: '0.875rem' }}>SKU: {sku}</p>
      <p style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
        ${price.toFixed(2)}
      </p>

      {description && (
        <p style={{ marginTop: '0.5rem', color: '#666', fontSize: '0.875rem' }}>
          {description}
        </p>
      )}

      <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
        {onEdit && (
          <button
            onClick={() => onEdit(id)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#0070f3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Edit
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(id)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#ff4444',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  )
}
