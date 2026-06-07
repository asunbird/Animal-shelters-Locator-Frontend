import './EvolvingBackground.css';
import { useBackgroundTimer } from './hooks/useBackgroundTimer';


const backgroundImages = [
  new URL('./assets/BGs/Desktop - Level-0.svg', import.meta.url).href,
  new URL('./assets/BGs/Desktop - Level-1.svg', import.meta.url).href,
  new URL('./assets/BGs/Desktop - Level-2.svg', import.meta.url).href,
  new URL('./assets/BGs/Desktop - Level-3.svg', import.meta.url).href,
  new URL('./assets/BGs/Desktop - Level-4.svg', import.meta.url).href,
  new URL('./assets/BGs/Desktop - Level-5.svg', import.meta.url).href,
  new URL('./assets/BGs/Desktop - Level-6.svg', import.meta.url).href,
];


function EvolvingBackground({ children }) {
  const currentLevel = useBackgroundTimer();
  
  return (
    <div className="app-container">
      {/* Background Layers */}
      <div className="background-wrapper">
        {backgroundImages.map((imgSrc, index) => (
          <div
            key={index}
            // Add the 'active' class only to the current level's image
            className={`bg-layer ${index === currentLevel ? 'active' : ''}`}
            style={{ backgroundImage: `url(${imgSrc})` }}
          />
        ))}
      </div>

      {/* Your Actual App Content */}
      <div className="app-content">
        {children}
      </div>
    </div>
  );
}

export default EvolvingBackground;