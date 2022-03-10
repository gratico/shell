import React from 'react'
import styled from '@emotion/styled'
import { IKernel } from '@gratico/sdk'
import { resolve } from '@thi.ng/resolve-map'

export type IKeyMap = { key: string[]; title?: string; cmd?: string }[]

export type IKeyMapConfiguration = {
	configuration: IKeyMap
	namedKeys: { [name: string]: string }
}

export const keymapConfig: IKeyMapConfiguration = {
	namedKeys: {
		leader: ' ',
		escape: 'Escape',
	},
	configuration: [
		{ key: ['@/namedKeys/leader'], title: 'Show Hydra' },
		{ key: ['@/namedKeys/leader', '@/namedKeys/leader'], cmd: 'command_bar.show', title: 'command bar' },
		{ key: ['@/namedKeys/leader', '/'], cmd: 'project.search.show', title: 'search project' },
		{ key: ['@/namedKeys/leader', 'b'], title: '+buffers' },
		{ key: ['@/namedKeys/leader', 'f'], title: '+files' },
		{ key: ['@/namedKeys/leader', 'f', 'o'], cmd: 'project.open_file', title: 'Open file' },
		{ key: ['@/namedKeys/leader', 'o'], title: '+open' },
		{ key: ['@/namedKeys/leader', 'g'], title: '+git' },
	],
}

export function getActiveHydraSteps(keymap: IKeyMap, activeKeys: string[]) {
	return keymap
		.filter((el) => el.key.length === activeKeys.length + 1)
		.filter((el) => el.key.slice(0, activeKeys.length).join('/') === activeKeys.join('/'))
}

export function formatKeycode(key: string) {
	if (key === ' ') return 'Space'
	return key
}

export function ActiveHydra(props: { kernel: IKernel; activeKeys: string[]; keymap: IKeyMap }) {
	const activeSteps = getActiveHydraSteps(props.keymap, props.activeKeys)
	return (
		<$HydraLayout>
			{activeSteps.map((step, i) => {
				return (
					<a href="#" key={i}>
						<span key="k">{formatKeycode(step.key[step.key.length - 1])}</span>
						<span key="t">{step.title}</span>
					</a>
				)
			})}
		</$HydraLayout>
	)
}

const $HydraLayout = styled.div`
	grid-template-columns: 260px 260px 260px;
	display: grid;
	> a {
		grid-template-columns: 80px 1fr;
		display: grid;
		text-decoration: none;
		color: inherit;
		font-size: 14px;
		font-family: monospace;
		> span:first-of-type {
			padding: 0 5px;
			width: 80px;
		}
		> span:last-of-type {
			font-weight: bold;
		}
	}
`

export function useKeyboard(keymapConfig: IKeyMapConfiguration) {
	const [keymap, setKeymap] = React.useState<IKeyMap | undefined>(undefined)
	const [activeKeys, setActiveKeys] = React.useState<string[]>([])
	React.useEffect(() => {
		const resolvedKeymapConfig = resolve(keymapConfig)
		const keymap: IKeyMap = resolvedKeymapConfig.configuration
		setKeymap(keymap)
		const handleKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				setActiveKeys([])
			}
			const newKey = [...activeKeys, e.key]
			const matchingKey = keymap
				.filter((el) => el.key.length == newKey.length)
				.find((el) => el.key.join('/') === newKey.join('/'))
			if (matchingKey && matchingKey.cmd) {
				return
			} else if (matchingKey) {
				setActiveKeys(newKey)
			}
		}
		document.addEventListener('keydown', handleKey)
		return () => {
			document.removeEventListener('keydown', handleKey)
		}
	}, [keymapConfig, activeKeys])
	return { keymap, activeKeys }
}

export function Hydra(props: { kernel: IKernel }) {
	const { keymap, activeKeys } = useKeyboard(keymapConfig)
	// console.log(activeKeys)
	return <$Container>{keymap && <ActiveHydra {...props} keymap={keymap} activeKeys={activeKeys} />}</$Container>
}

const $Container = styled.div``
