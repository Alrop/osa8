/** @format */
import { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { LOGIN, ALL_AUTHORS, ALL_BOOKS } from '../queries'

const LoginForm = ({ show, setPage, setToken }) => {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')

	const [login, result] = useMutation(LOGIN, {
		refetchQueries: [{ query: ALL_AUTHORS }, { query: ALL_BOOKS }],
		onError: (error) => {
			console.log(error.graphQLErrors[0].message)
		},
	})

	useEffect(() => {
		if (result.data) {
			const token = result.data.login.value
			setToken(token)
			localStorage.setItem('library-user-token', token)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [result.data])

	const submit = async (e) => {
		e.preventDefault()
		login({ variables: { username, password } })
		setPage('books')
	}

	if (!show) {
		return null
	}

	return (
		<div>
			<h2>Login form</h2>

			<form onSubmit={submit}>
				<div>
					Username:{' '}
					<input
						value={username}
						onChange={({ target }) => {
							setUsername(target.value)
						}}
					/>
				</div>
				Password:{' '}
				<input
					value={password}
					onChange={({ target }) => {
						setPassword(target.value)
					}}
				/>
				<button type='submit'>login</button>
			</form>
		</div>
	)
}

export default LoginForm
