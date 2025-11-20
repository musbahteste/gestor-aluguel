"use client";

import React, { useState } from 'react';

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
			// try to infer filename
			a.download = `boleto.pdf`;
			document.body.appendChild(a);
			a.click();
			a.remove();
			URL.revokeObjectURL(url);
		} catch (err) {
			// fallback: open in new tab
			window.open(ticketUrl, '_blank');
		}
	}

	return (
		<div style={{ padding: 20 }}>
			<h1>Gerar Boleto</h1>
			<form onSubmit={handleSubmit} style={{ maxWidth: 720 }}>
				<div style={{ marginBottom: 8 }}>
					<label>Valor (R$)</label>
					<input value={amount} onChange={(e) => setAmount(e.target.value)} />
				</div>

				<div style={{ marginBottom: 8 }}>
					<label>Descrição</label>
					<input value={description} onChange={(e) => setDescription(e.target.value)} />
				</div>

				<h3>Dados do Pagador</h3>
				<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
					<div>
						<label>Nome</label>
						<input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
					</div>
					<div>
						<label>Sobrenome</label>
						<input value={lastName} onChange={(e) => setLastName(e.target.value)} />
					</div>
					<div>
						<label>E-mail</label>
						<input value={email} onChange={(e) => setEmail(e.target.value)} />
					</div>
					<div>
						<label>CPF</label>
						<input value={cpf} onChange={(e) => setCpf(e.target.value)} />
					</div>
				</div>

				<h3>Endereço</h3>
				<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
					<div>
						<label>CEP</label>
						<input value={zip} onChange={(e) => setZip(e.target.value)} />
					</div>
					<div>
						<label>Estado</label>
						<input value={stateUf} onChange={(e) => setStateUf(e.target.value)} />
					</div>
					<div>
						<label>Cidade</label>
						<input value={city} onChange={(e) => setCity(e.target.value)} />
					</div>
					<div>
						<label>Bairro</label>
						<input value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} />
					</div>
					<div>
						<label>Rua</label>
						<input value={street} onChange={(e) => setStreet(e.target.value)} />
					</div>
					<div>
						<label>Número</label>
						<input value={streetNumber} onChange={(e) => setStreetNumber(e.target.value)} />
					</div>
				</div>

				<div style={{ marginTop: 12 }}>
					<button type="submit" disabled={loading}>
						{loading ? 'Gerando...' : 'Gerar Boleto'}
					</button>
				</div>

				{error && <div style={{ color: 'red', marginTop: 12 }}>{String(error)}</div>}
			</form>

			{showModal && ticketUrl && (
				<div
					style={{
						position: 'fixed',
						inset: 0,
						background: 'rgba(0,0,0,0.6)',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						zIndex: 9999,
					}}
					onClick={() => setShowModal(false)}
				>
					<div
						onClick={(e) => e.stopPropagation()}
						style={{ width: '90%', height: '90%', background: '#fff', position: 'relative' }}
					>
						<div style={{ padding: 8, display: 'flex', justifyContent: 'space-between' }}>
							<strong>Boleto Gerado</strong>
						</div>
						<iframe
							src={ticketUrl}
							title="boleto"
							style={{ width: '100%', height: 'calc(100% - 42px)', border: 'none' }}
						/>
					</div>
				</div>
			)}
		</div>
	);
}

