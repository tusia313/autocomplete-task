import { useState } from 'react';
import './App.css';

interface AutocompleteProps<T> {
  items: T[];
  selectedItems: T[];
  displayKey: keyof T;
  onChange: (items: T[]) => void;
  onCreateNew: (inputValue: string) => T;
}

export function Autocomplete<T>(props: AutocompleteProps<T>) {
  const { items, selectedItems, displayKey, onChange } = props;
  
  const [inputValue, setInputValue] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  const handleSelectItem = (item: T) => {
    if (!selectedItems.includes(item)) {
      onChange([...selectedItems, item]);
      setInputValue('');
      setHighlightedIndex(-1);
    }
  };

  const handleRemoveItem = (itemToRemove: T) => {
    const updatedItems = selectedItems.filter(item => item !== itemToRemove);
    onChange(updatedItems);
  };

  const availableSuggestions = items.filter(item => {
    const isAlreadySelected = selectedItems.includes(item);
    if (isAlreadySelected) return false;
    if (!inputValue.trim()) return true;

    const itemText = String(item[displayKey]).toLowerCase();
    const searchText = inputValue.toLowerCase();
    return itemText.includes(searchText);
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => 
        prev < availableSuggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev > -1 ? prev - 1 : -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < availableSuggestions.length) {
        handleSelectItem(availableSuggestions[highlightedIndex]);
      } else if (inputValue.trim() !== '') {
        const exactMatch = availableSuggestions.find(
          item => String(item[displayKey]).toLowerCase() === inputValue.trim().toLowerCase()
        );
        if (exactMatch) {
          handleSelectItem(exactMatch);
        } else {
          const newItem = props.onCreateNew(inputValue.trim());
          onChange([...selectedItems, newItem]);
          setInputValue('');
        }
      }
    }
  };

  const isListOpen = availableSuggestions.length > 0;

  return (
    <div className="autocomplete-wrapper">
      
      <div className="input-container">
        {selectedItems.map((item, index) => (
          <span key={index} className="tag-chip">
            {String(item[displayKey])}
            <button 
              type="button" 
              className="remove-tag-btn"
              onClick={() => handleRemoveItem(item)}
              // A11Y: Screen reader przeczyta np. "Usuń JavaScript"
              aria-label={`Usuń ${String(item[displayKey])}`}
            >
              ×
            </button>
          </span>
        ))}

        <input 
          type="text" 
          className="autocomplete-input"
          placeholder={selectedItems.length === 0 ? "Wyszukaj lub dodaj tag..." : ""}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setHighlightedIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          // --- SEKCJA A11Y ---
          role="combobox" // Informuje, że to input powiązany z listą
          aria-expanded={isListOpen} // Mówi, czy lista pod spodem jest teraz rozwinięta
          aria-controls="suggestions-listbox" // Wskazuje na ID listy poniżej
          aria-autocomplete="list" // Typ autouzupełniania
          aria-activedescendant={
            highlightedIndex >= 0 ? `suggestion-item-${highlightedIndex}` : undefined
          } // Wskazuje czytnikowi, który element z listy jest aktualnie podświetlony
        />
      </div>

      {isListOpen && (
        <ul 
          className="suggestions-list"
          // --- SEKCJA A11Y ---
          id="suggestions-listbox" 
          role="listbox" // Określa ten element jako listę opcji do wyboru
        >
          {availableSuggestions.map((item, index) => (
            <li 
              key={index} 
              id={`suggestion-item-${index}`} // Potrzebne dla aria-activedescendant w inpucie
              className={`suggestion-item ${index === highlightedIndex ? 'highlighted' : ''}`}
              onClick={() => handleSelectItem(item)}
              onMouseEnter={() => setHighlightedIndex(index)}
              // --- SEKCJA A11Y ---
              role="option" // Każdy element to pojedyncza opcja
              aria-selected={index === highlightedIndex} // Informuje, czy dana opcja jest zaznaczona strzałkami
            >
              {String(item[displayKey])}
            </li>
          ))}
        </ul>
      )}

    </div>
  );
}