<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let toast = $state<{ message: string; type: 'success' | 'error' } | null>(null);
	let resetConfirmation = $state('');
	let showResetConfirm = $state(false);
	let selectedFile = $state<File | null>(null);
	let fileInputRef = $state<HTMLInputElement | null>(null);

	function showToast(message: string, type: 'success' | 'error' = 'success') {
		toast = { message, type };
		setTimeout(() => {
			toast = null;
		}, 4000);
	}

	$effect(() => {
		if (form?.success && form?.message) {
			showToast(form.message, 'success');
			// Reset state after success
			if (form.action === 'import') {
				selectedFile = null;
				if (fileInputRef) fileInputRef.value = '';
			}
			if (form.action === 'reset') {
				resetConfirmation = '';
				showResetConfirm = false;
			}
		} else if (form?.error) {
			showToast(form.error, 'error');
		}
	});

	function handleFileSelect(event: Event) {
		const input = event.target as HTMLInputElement;
		selectedFile = input.files?.[0] || null;
	}

	function formatDate(dateString: string): string {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	function toggleResetConfirm() {
		showResetConfirm = !showResetConfirm;
		if (!showResetConfirm) {
			resetConfirmation = '';
		}
	}

	let canReset = $derived(resetConfirmation === 'RESET');
</script>

<svelte:head>
	<title>Settings | Cottage Clinic</title>
</svelte:head>

<div class="settings-page">
	<header class="page-header">
		<h1>Settings</h1>
		<p class="subtitle">Manage your cozy clinic</p>
	</header>

	<!-- Stats Section -->
	<section class="settings-section">
		<h2 class="section-title">
			<svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
			</svg>
			Your Journey
		</h2>
		<Card>
			<div class="stats-grid">
				<div class="stat-item">
					<span class="stat-value">{data.daysPlaying}</span>
					<span class="stat-label">Days Playing</span>
				</div>
				<div class="stat-item">
					<span class="stat-value">{data.lifetimeCoins.toLocaleString()}</span>
					<span class="stat-label">Coins Earned</span>
				</div>
				<div class="stat-item">
					<span class="stat-value">{data.completionsCount}</span>
					<span class="stat-label">Habits Completed</span>
				</div>
				<div class="stat-item">
					<span class="stat-value">{data.habitsCount}</span>
					<span class="stat-label">Active Habits</span>
				</div>
				<div class="stat-item">
					<span class="stat-value">{data.clientsSeen}</span>
					<span class="stat-label">Clients Seen</span>
				</div>
				<div class="stat-item">
					<span class="stat-value">{data.upgradesCount}</span>
					<span class="stat-label">Upgrades Owned</span>
				</div>
				<div class="stat-item">
					<span class="stat-value">{data.bestStreak}</span>
					<span class="stat-label">Best Streak</span>
				</div>
				<div class="stat-item stat-item-full">
					<span class="stat-label">Started on {formatDate(data.createdAt)}</span>
				</div>
			</div>
		</Card>
	</section>

	<!-- Export Section -->
	<section class="settings-section">
		<h2 class="section-title">
			<svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
			</svg>
			Export Save
		</h2>
		<Card>
			<p class="section-description">
				Download your save file to keep a backup or transfer your progress to another device.
			</p>
			<a href="/api/export" class="export-link" download>
				<Button variant="secondary">
					<svg class="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
					</svg>
					Download Save File
				</Button>
			</a>
		</Card>
	</section>

	<!-- Import Section -->
	<section class="settings-section">
		<h2 class="section-title">
			<svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
			</svg>
			Import Save
		</h2>
		<Card>
			<p class="section-description">
				Restore your progress from a previously exported save file. This will replace your current save.
			</p>
			<form
				method="POST"
				action="?/import"
				enctype="multipart/form-data"
				use:enhance={() => {
					return async ({ update }) => {
						await update();
					};
				}}
				class="import-form"
			>
				<div class="file-input-wrapper">
					<input
						bind:this={fileInputRef}
						type="file"
						name="saveFile"
						accept=".json"
						onchange={handleFileSelect}
						class="file-input"
						id="save-file-input"
					/>
					<label for="save-file-input" class="file-input-label">
						<svg class="file-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
						</svg>
						{#if selectedFile}
							<span class="file-name">{selectedFile.name}</span>
						{:else}
							<span>Choose a save file...</span>
						{/if}
					</label>
				</div>
				<Button type="submit" variant="primary" disabled={!selectedFile}>
					Import Save
				</Button>
			</form>
		</Card>
	</section>

	<!-- Reset Section -->
	<section class="settings-section settings-section-danger">
		<h2 class="section-title section-title-danger">
			<svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
			</svg>
			Danger Zone
		</h2>
		<Card class="danger-card">
			<p class="section-description">
				Reset all progress and start fresh. This action cannot be undone, but a backup will be saved automatically.
			</p>

			{#if !showResetConfirm}
				<Button variant="danger" onclick={toggleResetConfirm}>
					Reset All Progress
				</Button>
			{:else}
				<form
					method="POST"
					action="?/reset"
					use:enhance={() => {
						return async ({ update }) => {
							await update();
						};
					}}
					class="reset-form"
				>
					<div class="reset-confirm-box">
						<p class="reset-warning">
							This will delete all your habits, completions, upgrades, and coins.
							Type <strong>RESET</strong> to confirm.
						</p>
						<input
							type="text"
							name="confirmation"
							bind:value={resetConfirmation}
							placeholder="Type RESET to confirm"
							class="reset-input"
							autocomplete="off"
						/>
						<div class="reset-actions">
							<Button type="button" variant="secondary" onclick={toggleResetConfirm}>
								Cancel
							</Button>
							<Button type="submit" variant="danger" disabled={!canReset}>
								Confirm Reset
							</Button>
						</div>
					</div>
				</form>
			{/if}
		</Card>
	</section>

	{#if toast}
		<div class="toast toast-{toast.type}" role="alert">
			{#if toast.type === 'success'}
				<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
			{:else}
				<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
				</svg>
			{/if}
			<span>{toast.message}</span>
		</div>
	{/if}
</div>

<style>
	.settings-page {
		max-width: 640px;
		margin: 0 auto;
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.page-header {
		text-align: center;
		margin-bottom: 0.5rem;
	}

	.page-header h1 {
		font-family: var(--font-display);
		font-size: 2rem;
		color: var(--color-bark-500);
		margin: 0;
	}

	.subtitle {
		color: var(--color-bark-400);
		margin: 0.25rem 0 0 0;
		font-size: 0.9375rem;
	}

	.settings-section {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.section-title {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-family: var(--font-display);
		font-size: 1.25rem;
		color: var(--color-bark-500);
		margin: 0;
	}

	.section-title-danger {
		color: var(--color-rose-400);
	}

	.section-icon {
		width: 1.25rem;
		height: 1.25rem;
		flex-shrink: 0;
	}

	.section-description {
		color: var(--color-bark-400);
		margin: 0 0 1rem 0;
		font-size: 0.9375rem;
		line-height: 1.5;
	}

	/* Stats Grid */
	.stats-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1rem;
	}

	.stat-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 1rem 0.5rem;
		background-color: var(--color-cream-100);
		border-radius: var(--radius-cottage);
	}

	.stat-item-full {
		grid-column: 1 / -1;
		background-color: transparent;
		padding: 0.5rem;
	}

	.stat-value {
		font-family: var(--font-display);
		font-size: 1.75rem;
		font-weight: 700;
		color: var(--color-sage-500);
	}

	.stat-label {
		font-size: 0.8125rem;
		color: var(--color-bark-400);
		text-align: center;
	}

	/* Export Section */
	.export-link {
		text-decoration: none;
		display: inline-block;
	}

	.button-icon {
		width: 1.125rem;
		height: 1.125rem;
	}

	/* Import Section */
	.import-form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.file-input-wrapper {
		position: relative;
	}

	.file-input {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}

	.file-input-label {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 1rem;
		background-color: var(--color-cream-100);
		border: 2px dashed var(--color-bark-200);
		border-radius: var(--radius-cottage);
		cursor: pointer;
		transition: all 0.2s ease;
		color: var(--color-bark-400);
	}

	.file-input-label:hover {
		border-color: var(--color-sage-400);
		background-color: var(--color-cream-200);
	}

	.file-input:focus + .file-input-label {
		outline: 2px solid var(--color-sage-400);
		outline-offset: 2px;
	}

	.file-icon {
		width: 1.5rem;
		height: 1.5rem;
		flex-shrink: 0;
	}

	.file-name {
		color: var(--color-bark-500);
		font-weight: 500;
	}

	/* Reset Section */
	.settings-section-danger {
		margin-top: 1rem;
	}

	:global(.danger-card) {
		border: 1px solid var(--color-rose-200);
	}

	.reset-form {
		margin-top: 0.5rem;
	}

	.reset-confirm-box {
		padding: 1rem;
		background-color: var(--color-rose-50);
		border-radius: var(--radius-cottage);
		border: 1px solid var(--color-rose-200);
	}

	.reset-warning {
		color: var(--color-rose-400);
		margin: 0 0 1rem 0;
		font-size: 0.9375rem;
		line-height: 1.5;
	}

	.reset-warning strong {
		font-weight: 700;
	}

	.reset-input {
		width: 100%;
		padding: 0.75rem 1rem;
		font-size: 1rem;
		font-family: var(--font-body);
		border: 2px solid var(--color-rose-200);
		border-radius: var(--radius-cottage);
		background-color: white;
		color: var(--color-bark-500);
		margin-bottom: 1rem;
	}

	.reset-input:focus {
		outline: none;
		border-color: var(--color-rose-400);
	}

	.reset-input::placeholder {
		color: var(--color-bark-300);
	}

	.reset-actions {
		display: flex;
		gap: 0.75rem;
		justify-content: flex-end;
	}

	/* Toast */
	.toast {
		position: fixed;
		bottom: 1.5rem;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.875rem 1.25rem;
		border-radius: var(--radius-cottage);
		font-weight: 600;
		font-size: 0.9375rem;
		box-shadow: var(--shadow-cottage-lg);
		animation: toast-slide-up 0.3s ease;
		z-index: 100;
		max-width: calc(100vw - 2rem);
	}

	.toast-success {
		background-color: var(--color-sage-500);
		color: white;
	}

	.toast-error {
		background-color: var(--color-rose-400);
		color: white;
	}

	.toast-icon {
		width: 1.25rem;
		height: 1.25rem;
		flex-shrink: 0;
	}

	@keyframes toast-slide-up {
		from {
			opacity: 0;
			transform: translateX(-50%) translateY(1rem);
		}
		to {
			opacity: 1;
			transform: translateX(-50%) translateY(0);
		}
	}

	@media (min-width: 480px) {
		.stats-grid {
			grid-template-columns: repeat(4, 1fr);
		}
	}

	@media (max-width: 480px) {
		.reset-actions {
			flex-direction: column;
		}
	}
</style>
