"use client";

import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

interface DateInputProps {
  id: string;
  value: string; // YYYY-MM-DD format (for API)
  onChange: (value: string) => void; // Returns YYYY-MM-DD format
  required?: boolean;
  placeholder?: string;
}

/**
 * Converts YYYY-MM-DD to dd/mm/yyyy
 */
function formatToDisplay(dateString: string): string {
  if (!dateString) return "";
  const match = dateString.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (match) {
    const [, year, month, day] = match;
    return `${day}/${month}/${year}`;
  }
  return dateString;
}

/**
 * Formats input as dd/mm/yyyy while typing
 */
function formatInput(value: string): string {
  // Remove all non-digit characters
  const digits = value.replace(/\D/g, "");
  
  if (digits.length === 0) return "";
  
  // Limit to 8 digits (ddmmyyyy)
  const limitedDigits = digits.slice(0, 8);
  
  // Format as dd/mm/yyyy
  if (limitedDigits.length <= 2) {
    return limitedDigits;
  } else if (limitedDigits.length <= 4) {
    return limitedDigits.slice(0, 2) + "/" + limitedDigits.slice(2);
  } else {
    return limitedDigits.slice(0, 2) + "/" + limitedDigits.slice(2, 4) + "/" + limitedDigits.slice(4);
  }
}

/**
 * Converts dd/mm/yyyy to YYYY-MM-DD
 */
function formatToAPI(dateString: string): string {
  // Remove all non-digit characters
  const digits = dateString.replace(/\D/g, "");
  
  if (digits.length !== 8) return "";
  
  const day = digits.slice(0, 2);
  const month = digits.slice(2, 4);
  const year = digits.slice(4, 8);
  
  // Validate date
  const dayNum = parseInt(day, 10);
  const monthNum = parseInt(month, 10);
  const yearNum = parseInt(year, 10);
  
  if (
    dayNum >= 1 && dayNum <= 31 &&
    monthNum >= 1 && monthNum <= 12 &&
    yearNum >= 1900 && yearNum <= 2100
  ) {
    // Additional validation: check if date is valid
    const date = new Date(yearNum, monthNum - 1, dayNum);
    if (
      date.getFullYear() === yearNum &&
      date.getMonth() === monthNum - 1 &&
      date.getDate() === dayNum
    ) {
      return `${year}-${month}-${day}`;
    }
  }
  
  return "";
}

export function DateInput({ id, value, onChange, required, placeholder = "dd/mm/yyyy" }: DateInputProps) {
  const [displayValue, setDisplayValue] = useState(formatToDisplay(value));

  // Update display value when prop value changes (e.g., from external source)
  useEffect(() => {
    setDisplayValue(formatToDisplay(value));
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Format the input as user types
    const formatted = formatInput(inputValue);
    setDisplayValue(formatted);
    
    // Convert to API format and call onChange if valid
    const apiValue = formatToAPI(formatted);
    if (apiValue) {
      onChange(apiValue);
    } else if (formatted === "") {
      onChange("");
    }
  };

  const handleBlur = () => {
    // Validate and format on blur
    const apiValue = formatToAPI(displayValue);
    if (apiValue) {
      setDisplayValue(formatToDisplay(apiValue));
      onChange(apiValue);
    } else if (displayValue && displayValue.replace(/\D/g, "").length > 0) {
      // If there's input but it's invalid, clear it
      setDisplayValue("");
      onChange("");
    }
  };

  return (
    <Input
      id={id}
      type="text"
      value={displayValue}
      onChange={handleChange}
      onBlur={handleBlur}
      required={required}
      placeholder={placeholder}
      maxLength={10}
    />
  );
}

