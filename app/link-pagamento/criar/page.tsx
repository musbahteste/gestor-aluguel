"use client";

import React, { useState } from 'react';

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
		<div style={{ padding: 16 }}>
			<h1>Criar link de pagamento</h1>

			<form onSubmit={handleSubmit} style={{ maxWidth: 600 }}>
				<div style={{ marginBottom: 8 }}>
					<label>Título</label>
					<input value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: '100%' }} />
				</div>

				<div style={{ marginBottom: 8 }}>
					<label>Descrição</label>
					<input value={description} onChange={(e) => setDescription(e.target.value)} style={{ width: '100%' }} />
				</div>

				<div style={{ marginBottom: 8 }}>
					<label>Valor (R$)</label>
					<input value={unitPrice} onChange={(e) => setUnitPrice(e.target.value)} style={{ width: '100%' }} />
				</div>

				<div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
					<div style={{ flex: 1 }}>
						<label>Nome</label>
						<input value={firstName} onChange={(e) => setFirstName(e.target.value)} style={{ width: '100%' }} />
					</div>
					<div style={{ flex: 1 }}>
						<label>Sobrenome</label>
						<input value={lastName} onChange={(e) => setLastName(e.target.value)} style={{ width: '100%' }} />
					</div>
				</div>

				<div style={{ marginBottom: 8 }}>
					<label>E-mail</label>
					<input value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%' }} />
				</div>

				<div style={{ marginTop: 12 }}>
					<button type="submit" disabled={loading}>{loading ? 'Gerando...' : 'Gerar link de pagamento'}</button>
				</div>
			</form>

			{showModal && initPoint && (
				<div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
					<div style={{ width: '90%', maxWidth: 1000, background: '#fff', padding: 12, borderRadius: 6 }}>
						<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
							<div>
								<strong>Link de pagamento</strong>
								<div style={{ fontSize: 12 }}>{preferenceId}</div>
							</div>
							<div style={{ display: 'flex', gap: 8 }}>
								<button onClick={handleCopyLink}>Copiar link</button>
								<a href={initPoint} target="_blank" rel="noreferrer"><button>Abrir em nova aba</button></a>
								<button onClick={() => setShowModal(false)}>Fechar</button>
							</div>
						</div>

						<iframe src={initPoint} style={{ width: '100%', height: '70vh', border: 'none' }} />
					</div>
				</div>
			)}
		</div>
	);
}

