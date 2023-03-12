export const App: PHTML.FC = () => {
	return (
		<div id="root" className="rofl">
			<p id="first">help me!</p>
			<p>help me!</p>
			<p>help me!</p>
			<>
				kfodwkdw
				<div>helepe</div>
				<p>wodkwodkw</p>
			</>
			<div>
				<div>
					<p>inner</p>
				</div>
			</div>
			{new Array(10).fill(0).map((_, i) => i % 2 === 0 && <p key={i}>{i}</p>)}
			{new Array(10).fill(0).map((_, i) => i % 2 === 1 && <p key={i}>{i}</p>)}
		</div>
	);
};
