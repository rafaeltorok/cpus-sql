// React
import { useState } from 'react';

// CSS styles
import "../styles/pageIndex.css";

// TypeScript types
import type { CpuType } from '../types/types';

interface PageIndexProps {
	cpusData: CpuType[];
};


// Component
export default function PageIndex({ cpusData }: PageIndexProps) {
  const [showIndex, setShowIndex] = useState(false);

  // Scroll to cpu when index item is clicked
  const scrollToCpu = (id: string) => {
		const cpuTable = document.getElementById(id);
    if (cpuTable) {
      cpuTable.scrollIntoView({ behavior: 'smooth' });
			const button = cpuTable.querySelector('.show-hide-button');
			if (button && button.textContent === 'Show') {
				button.click();
			}
    }
  };
  
  return (
    <div id="page-index-container">
			<button
				id='show-index-button'
				type='button'
				onClick={() => setShowIndex((prev) => !prev)}
			>
				{showIndex ? "Hide index" : "Show index"}
			</button>
			{showIndex && (
				<div className='index-list-container'>
					<ul className="index-list">
						{cpusData.map((cpu) => (
							<li key={cpu.id}>
								<button 
									className='index-item-button'
									onClick={() => scrollToCpu(
										`${cpu.manufacturer.toLowerCase()}-${cpu.model.toLowerCase()}`
									)}
								>
									<span
										className={
											cpu.manufacturer.toLowerCase() === 'amd'
												? 'amd-model-header'
												: cpu.manufacturer.toLowerCase() === 'intel'
												? 'intel-model-header'
												: 'model-header'
										}
										>{cpu.manufacturer} {cpu.model}
									</span>
								</button>
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
  )
}
