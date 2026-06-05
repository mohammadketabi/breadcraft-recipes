export default function ItemList({ label, items, onChange, placeholder, multiline }) {
  function updateItem(index, value) {
    onChange(items.map((item, i) => (i === index ? value : item)));
  }

  function addItem() {
    onChange([...items, ""]);
  }

  function removeItem(index) {
    const next = items.filter((_, i) => i !== index);
    onChange(next.length ? next : [""]);
  }

  return (
    <div className="item-list">
      <span className="item-list-label">{label}</span>

      {items.map((item, index) => (
        <div key={index} className="item-list-row">
          <span className="item-list-num">{index + 1}</span>

          {multiline ? (
            <textarea
              className="item-list-input"
              placeholder={`${placeholder} ${index + 1}`}
              value={item}
              rows={2}
              onChange={(e) => updateItem(index, e.target.value)}
            />
          ) : (
            <input
              type="text"
              className="item-list-input"
              placeholder={`${placeholder} ${index + 1}`}
              value={item}
              onChange={(e) => updateItem(index, e.target.value)}
            />
          )}

          <button
            type="button"
            className="item-list-remove"
            onClick={() => removeItem(index)}
            aria-label="Remove"
            disabled={items.length === 1 && item === ""}
          >
            ×
          </button>
        </div>
      ))}

      <button type="button" className="item-list-add" onClick={addItem}>
        + Add {label === "Steps" ? "step" : "ingredient"}
      </button>
    </div>
  );
}
