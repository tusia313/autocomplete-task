import { useState } from 'react';
import './App.css';
import { Autocomplete } from './Autocomplete';

interface TechTag {
  id: string;
  name: string;
}

const DUMMY_TAGS: TechTag[] = [
  { id: '1', name: 'JavaScript' },
  { id: '2', name: 'TypeScript' },
  { id: '3', name: 'React' },
  { id: '4', name: 'Zustand' },
  { id: '5', name: 'HTML' },
  { id: '6', name: 'CSS' },
];

function App() {
  const [selectedTags, setSelectedTags] = useState<TechTag[]>([]);

  const handleCreateNew = (inputValue: string): TechTag => {
    return {
      id: crypto.randomUUID(),
      name: inputValue,
    };
  };

  return (
    <div className="app-container">
      
      <h1 className="app-title">Task</h1>
      
      <Autocomplete<TechTag> 
        items={DUMMY_TAGS}
        selectedItems={selectedTags}
        displayKey="name" 
        onChange={setSelectedTags}
        onCreateNew={handleCreateNew}
      />

    </div>
  );
}

export default App;