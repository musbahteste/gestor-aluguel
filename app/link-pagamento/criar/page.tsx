"use client";

import React, { useState } from 'react';
import PageWrapper from '../../components/PageWrapper';

export default function CriarLinkPagamentoPage() {
	const [title, setTitle] = useState('Pagamento');
	const [description, setDescription] = useState('');
	const [unitPrice, setUnitPrice] = useState('0.00');
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [email, setEmail] = useState('');

	const [loading, setLoading] = useState(false);
	const [initPoint, setInitPoint] = useState<string | null>(null);
	const [preferenceId, setPreferenceId] = useState<string | null>(null);
	const [showModal, setShowModal] = useState(false);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setLoading(true);

		try {
			const payload = {
				title,
				description,
				unit_price: Number(unitPrice),
				quantity: 1,
				payer: {
					name: firstName,
					surname: lastName,
					email,
				},
			};

			const res = await fetch('/api/link-pagamento/generate', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload),
			});

			const data = await res.json();

			if (!res.ok) {
				console.error('Erro MercadoPago:', data);
				alert('Erro ao gerar link: ' + (data?.error?.message || JSON.stringify(data)));
				return;
			}

			setInitPoint(data.initPoint || data.init_point || null);
			setPreferenceId(data.preferenceId || data.id || null);
			setShowModal(true);
		} catch (err) {
			console.error('Erro criando preferência:', err);
			alert('Erro ao criar preferência');
		} finally {
			setLoading(false);
		}
	}

	const handleCopyLink = async () => {
		if (!initPoint) return;
		try {
			await navigator.clipboard.writeText(initPoint);
			alert('Link copiado para a área de transferência.');
		} catch (err) {
			console.error('Erro copiando link:', err);
			alert('Falha ao copiar link');
		}
	};

	return (
		<PageWrapper title="Criar Link de Pagamento">
			<form onSubmit={handleSubmit} className="max-w-2xl space-y-4 bg-white p-6 rounded-lg shadow">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
					<input 
						type="text"
						value={title} 
						onChange={(e) => setTitle(e.target.value)} 
						className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
					<input 
						type="text"
						value={description} 
						onChange={(e) => setDescription(e.target.value)} 
						className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">Valor (R$)</label>
					<input 
						type="text"
						value={unitPrice} 
						onChange={(e) => setUnitPrice(e.target.value)} 
						className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					/>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
						<input 
							type="text"
							value={firstName} 
							onChange={(e) => setFirstName(e.target.value)} 
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Sobrenome</label>
						<input 
							type="text"
							value={lastName} 
							onChange={(e) => setLastName(e.target.value)} 
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						/>
					</div>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
					<input 
						type="email"
						value={email} 
						onChange={(e) => setEmail(e.target.value)} 
						className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					/>
				</div>

				<div className="pt-4">
					<button 
						type="submit" 
						disabled={loading}
						className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
					>
						{loading ? 'Gerando...' : 'Gerar link de pagamento'}
					</button>
				</div>
			</form>

			{showModal && initPoint && (
				<div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
					<div className="w-11/12 max-w-5xl bg-white p-6 rounded-lg">
						<div className="flex justify-between items-start mb-4">
							<div>
								<strong className="text-lg block mb-1">Link de pagamento</strong>
								<div className="text-xs text-gray-600">{preferenceId}</div>
							</div>
							<div className="flex gap-2 flex-wrap">
								<button 
									onClick={handleCopyLink}
									className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
								>
									Copiar link
								</button>
								<a href={initPoint} target="_blank" rel="noreferrer">
									<button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
										Abrir em nova aba
									</button>
								</a>
								<button 
									onClick={() => setShowModal(false)}
									className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium"
								>
									Fechar
								</button>
							</div>
						</div>

						<iframe src={initPoint} className="w-full h-96 border-none rounded-lg" />
					</div>
				</div>
			)}
		</PageWrapper>
	);
}

