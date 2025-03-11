/** @format */

import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'
import { useState } from 'react'
/** @format */

const Books = ({ show }) => {
	const [genre, setGenre] = useState(null)
	const result = useQuery(ALL_BOOKS, { variables: { genre: genre } })
	if (!show) {
		return null
	}
	if (result.loading) {
		return <div>Loading data...</div>
	}
	console.log(result)
	const books = result.data.allBooks
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flatMap
	// const genresList = books.flatMap((book) => book.genres)
	// const genres = [...new Set(genresList)]

	return (
		<div>
			<h2>books</h2>
			{genre && (
				<p>
					in genre <b>{genre}</b>
				</p>
			)}
			<table>
				<tbody>
					<tr>
						<th></th>
						<th>author</th>
						<th>published</th>
					</tr>
					{books.map((book) => (
						<tr key={book.id}>
							<td>{book.title}</td>
							<td>{book.author.name}</td>
							<td>{book.published}</td>
						</tr>
					))}
				</tbody>
			</table>
			<div>
				<button onClick={() => setGenre('refactoring')}>refacoring</button>
				<button onClick={() => setGenre('agile')}>agile</button>
				<button onClick={() => setGenre('patterns')}>patterns</button>
				<button onClick={() => setGenre('design')}>design</button>
				<button onClick={() => setGenre('crime')}>crime</button>
				<button onClick={() => setGenre('classic')}>classic</button>
				<button onClick={() => setGenre('revolution')}>revulotion</button>
				<button onClick={() => setGenre(null)}>all books</button>
			</div>
		</div>
	)
}

export default Books
