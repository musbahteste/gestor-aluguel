"use client";

import React, { useState } from 'react';
import PageWrapper from '../../components/PageWrapper';

export default function CriarBoletoPage() {
	const [amount, setAmount] = useState('55.50');
	const [description, setDescription] = useState('Teste Final de Geração de Boleto');
	const [firstName, setFirstName] = useState('Testador');
	const [lastName, setLastName] = useState('API');
	const [email, setEmail] = useState('paticriscardoso@gmail.com');
	const [cpf, setCpf] = useState('78006511187');
	const [zip, setZip] = useState('78891153');
	const [street, setStreet] = useState('Rua Sao Borja');
	const [streetNumber, setStreetNumber] = useState('2730');
	const [neighborhood, setNeighborhood] = useState('Vila Romana');
	const [city, setCity] = useState('Sorriso');
	const [stateUf, setStateUf] = useState('MT');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [ticketUrl, setTicketUrl] = useState<string | null>(null);
	const [showModal, setShowModal] = useState(false);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError(null);
		setLoading(true);

		const payload = {
			transaction_amount: parseFloat(amount),
			description,
			payment_method_id: 'bolbradesco',
			installments: 1,
			payer: {
				email,
				first_name: firstName,
				last_name: lastName,
				identification: { type: 'CPF', number: cpf },
				address: {
					zip_code: zip,
					street_name: street,
					street_number: streetNumber,
					neighborhood,
					city,
					federal_unit: stateUf,
				},
			},
		};

		try {
			const res = await fetch('/api/boleto/generate', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload),
			});

			const data = await res.json();
			if (!res.ok) {
				setError(data?.error?.details || data?.error || 'Erro ao gerar boleto');
				setLoading(false);
				return;
			}

			if (data?.ticket_url) {
				setTicketUrl(data.ticket_url);
				setShowModal(true);
			} else if (data?.raw?.point_of_interaction?.transaction_data?.ticket_url) {
				setTicketUrl(data.raw.point_of_interaction.transaction_data.ticket_url);
				setShowModal(true);
			} else {
				setError('Não foi possível obter a URL do boleto. Veja resposta: ' + JSON.stringify(data));
			}
		} catch (err: any) {
			setError(err?.message || 'Erro desconhecido');
		} finally {
			setLoading(false);
		}
	}

	async function handleDownload() {
		if (!ticketUrl) return;
		try {
			const res = await fetch(ticketUrl);
			if (!res.ok) throw new Error('Falha ao baixar');
			const blob = await res.blob();
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = `boleto.pdf`;
			document.body.appendChild(a);
			a.click();
			a.remove();
			URL.revokeObjectURL(url);
		} catch (err) {
			window.open(ticketUrl, '_blank');
		}
	}

	return (
		<PageWrapper title="Gerar Boleto">
			<form onSubmit={handleSubmit} className="max-w-4xl space-y-6 bg-white p-6 rounded-lg shadow">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">Valor (R$)</label>
					<input 
						type="text"
						value={amount} 
						onChange={(e) => setAmount(e.target.value)} 
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
					<h3 className="text-lg font-semibold text-gray-800 mb-4">Dados do Pagador</h3>
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
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
							<input 
								type="email"
								value={email} 
								onChange={(e) => setEmail(e.target.value)} 
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
							<input 
								type="text"
								value={cpf} 
								onChange={(e) => setCpf(e.target.value)} 
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							/>
						</div>
					</div>
				</div>

				<div>
					<h3 className="text-lg font-semibold text-gray-800 mb-4">Endereço</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">CEP</label>
							<input 
								type="text"
								value={zip} 
								onChange={(e) => setZip(e.target.value)} 
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
							<input 
								type="text"
								value={stateUf} 
								onChange={(e) => setStateUf(e.target.value)} 
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
							<input 
								type="text"
								value={city} 
								onChange={(e) => setCity(e.target.value)} 
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Bairro</label>
							<input 
								type="text"
								value={neighborhood} 
								onChange={(e) => setNeighborhood(e.target.value)} 
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Rua</label>
							<input 
								type="text"
								value={street} 
								onChange={(e) => setStreet(e.target.value)} 
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Número</label>
							<input 
								type="text"
								value={streetNumber} 
								onChange={(e) => setStreetNumber(e.target.value)} 
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							/>
						</div>
					</div>
				</div>

				<div className="pt-4">
					<button 
						type="submit" 
						disabled={loading}
						className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
					>
						{loading ? 'Gerando...' : 'Gerar Boleto'}
					</button>
				</div>

				{error && <div className="text-red-600 text-sm mt-4">{String(error)}</div>}
			</form>

			{showModal && ticketUrl && (
				<div
					className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
					onClick={() => setShowModal(false)}
				>
					<div
						onClick={(e) => e.stopPropagation()}
						className="w-11/12 h-5/6 bg-white relative flex flex-col"
					>
						<div className="p-4 border-b border-gray-200 flex justify-between items-center">
							<strong className="text-lg">Boleto Gerado</strong>
							<div className="flex gap-2">
								<button 
									onClick={handleDownload}
									className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
								>
									Baixar
								</button>
								<button 
									onClick={() => setShowModal(false)}
									className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium"
								>
									Fechar
								</button>
							</div>
						</div>
						<iframe
							src={ticketUrl}
							title="boleto"
							className="flex-1 border-none"
						/>
					</div>
				</div>
			)}
		</PageWrapper>
	);
}

