/** @format */
import { useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries'

const Authors = ({ show }) => {
	const [editAuthor] = useMutation(EDIT_AUTHOR, {
		refetchQueries: [{ query: ALL_AUTHORS }],
	})
	const [name, setName] = useState('')
	const [born, setBorn] = useState('')

	const submit = async (e) => {
		e.preventDefault()
		editAuthor({ variables: { name, born } })
		setName('')
		setBorn('')
		document.getElementById('bornForm').reset()
	}
	const result = useQuery(ALL_AUTHORS)

	if (!show) {
		return null
	}
	if (result.loading) {
		return <div>Loading data...</div>
	}
	const authors = result.data.allAuthors

	return (
		<div>
			<h2>authors</h2>
			<table>
				<tbody>
					<tr>
						<th></th>
						<th>born</th>
						<th>books</th>
					</tr>
					{authors.map((a) => (
						<tr key={a.name}>
							<td>{a.name}</td>
							<td>{a.born}</td>
							<td>{a.bookCount}</td>
						</tr>
					))}
					<tr></tr>
				</tbody>
			</table>

			<form id='bornForm' onSubmit={submit}>
				<h3>Set author birthyear</h3>
				<div>
					Author:{' '}
					<select value={name} onChange={({ target }) => setName(target.value)}>
						{authors.map((author) => (
							<option key={author.id}>{author.name}</option>
						))}
					</select>
				</div>
				<div>
					Born:{' '}
					<input type='text' onChange={({ target }) => setBorn(target.value)} />
				</div>
				<button type='submit'>Update</button>
			</form>
		</div>
	)
}

export default Authors
