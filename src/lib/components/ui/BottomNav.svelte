<script lang="ts">
	import { page } from '$app/stores';

	interface NavItem {
		href: string;
		label: string;
		icon: string;
	}

	const navItems: NavItem[] = [
		{
			href: '/',
			label: 'Home',
			icon: 'home'
		},
		{
			href: '/habits',
			label: 'Habits',
			icon: 'habits'
		},
		{
			href: '/clinic',
			label: 'Clinic',
			icon: 'clinic'
		},
		{
			href: '/stats',
			label: 'Stats',
			icon: 'stats'
		},
		{
			href: '/shop',
			label: 'Shop',
			icon: 'shop'
		}
	];

	function isActive(href: string, pathname: string): boolean {
		if (href === '/') {
			return pathname === '/';
		}
		return pathname.startsWith(href);
	}
</script>

<nav class="bottom-nav" aria-label="Main navigation">
	{#each navItems as item}
		{@const active = isActive(item.href, $page.url.pathname)}
		<a href={item.href} class="nav-item" class:active aria-current={active ? 'page' : undefined}>
			<span class="nav-icon" aria-hidden="true">
				{#if item.icon === 'home'}
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M3 12l9-9 9 9" stroke-linecap="round" stroke-linejoin="round" />
						<path d="M5 10v10a1 1 0 001 1h3a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h3a1 1 0 001-1V10" stroke-linecap="round" stroke-linejoin="round" />
					</svg>
				{:else if item.icon === 'habits'}
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<rect x="3" y="4" width="18" height="18" rx="2" />
						<path d="M9 12l2 2 4-4" stroke-linecap="round" stroke-linejoin="round" />
						<line x1="3" y1="10" x2="21" y2="10" />
					</svg>
				{:else if item.icon === 'clinic'}
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<rect x="4" y="10" width="16" height="11" rx="1" />
						<polygon points="2,10 12,3 22,10" fill="none" />
						<rect x="9" y="14" width="6" height="7" />
						<line x1="12" y1="7" x2="12" y2="7" stroke-linecap="round" />
					</svg>
				{:else if item.icon === 'stats'}
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M18 20V10" stroke-linecap="round" stroke-linejoin="round" />
						<path d="M12 20V4" stroke-linecap="round" stroke-linejoin="round" />
						<path d="M6 20v-6" stroke-linecap="round" stroke-linejoin="round" />
					</svg>
				{:else if item.icon === 'shop'}
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
						<line x1="3" y1="6" x2="21" y2="6" />
						<path d="M16 10a4 4 0 01-8 0" />
					</svg>
				{/if}
			</span>
			<span class="nav-label">{item.label}</span>
		</a>
	{/each}
</nav>

<style>
	.bottom-nav {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		display: flex;
		justify-content: space-around;
		align-items: center;
		background-color: var(--color-cream-50);
		border-top: 1px solid var(--color-cream-300);
		box-shadow: 0 -2px 10px rgba(139, 90, 60, 0.08);
		padding: 0.5rem 0;
		padding-bottom: calc(0.5rem + env(safe-area-inset-bottom, 0px));
		z-index: 50;
	}

	.nav-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.25rem;
		padding: 0.5rem 1rem;
		text-decoration: none;
		color: var(--color-bark-300);
		transition: color 0.2s ease;
		border-radius: var(--radius-cottage);
	}

	.nav-item:hover {
		color: var(--color-bark-400);
	}

	.nav-item.active {
		color: var(--color-sage-500);
	}

	.nav-item:focus-visible {
		outline: 2px solid var(--color-sage-400);
		outline-offset: 2px;
	}

	.nav-icon {
		width: 1.5rem;
		height: 1.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.nav-icon svg {
		width: 100%;
		height: 100%;
	}

	.nav-label {
		font-size: 0.6875rem;
		font-weight: 600;
	}

	.active .nav-icon {
		transform: scale(1.1);
	}
</style>
