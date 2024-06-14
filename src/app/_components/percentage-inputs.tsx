import React, { useState, ChangeEvent } from 'react'

interface PercentageInputProps {
  value: number
  onChange: (value: number) => void
}

const PercentageInput: React.FC<PercentageInputProps> = ({
  value,
  onChange,
  ...props
}) => {
  const [internalValue, setInternalValue] = useState<number>(value)

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace('%', '')
    const numVal = Number(val)

    if (!isNaN(numVal) && numVal >= 0 && numVal <= 100) {
      setInternalValue(numVal)
      if (onChange) {
        onChange(numVal)
      }
    }
  }

  return (
    <div className="relative">
      <input
        type="text"
        value={`${internalValue}%`}
        onChange={handleInputChange}
        className="rounded border py-1 pl-2 pr-8"
        {...props}
      />
      <span className="absolute right-2 top-1/2 -translate-y-1/2 transform text-gray-500">
        %
      </span>
    </div>
  )
}

export default PercentageInput
