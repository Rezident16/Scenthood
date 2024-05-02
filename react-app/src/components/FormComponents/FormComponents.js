

export const Input = ({ label, value, setValue, error, className }) => (
  <label className={className}>
    <div>
      {label}
      <span aria-hidden="true" className="required">*</span>
    </div>
    <input type="text" value={value} onChange={(e) => setValue(e.target.value)} required />
    {error && <span className="errors">{error}</span>}
  </label>
);

// Reusable TextArea Component
export const TextArea = ({ label, value, setValue, error, className }) => (
  <label className={className}>
    <div>
      {label}
      <span aria-hidden="true" className="required">*</span>
    </div>
    <textarea rows="10" value={value} onChange={(e) => setValue(e.target.value)} required />
    {error && <span className="errors">{error}</span>}
  </label>
);

// Reusable FileInput Component
export const FileInput = ({ label, setFile, error, className }) => {
  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setFile(file);
  };

  return (
    <label className={className}>
      <div>
        {label}
        <span aria-hidden="true" className="required">*</span>
      </div>
      <input type="file" accept=".jpg, .jpeg, .png" onChange={onFileChange} required />
      {error && <span className="errors">{error}</span>}
    </label>
  );
};
