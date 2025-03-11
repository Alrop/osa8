/** @format */

import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'

const Recommendation = ({ show, favGenre }) => {
	// console.log(favGenre)
	const { data } = useQuery(ALL_BOOKS, {
		variables: { genre: favGenre },
	})

	if (!show) {
		return null
	}
	if (data.loading) {
		return <div>Loading data...</div>
	}
	const books = data.allBooks

	return (
		<div>
			<h2>Recommendations</h2>
			<p>
				Books in your favourite genre <b>{favGenre}</b>
			</p>

			<div>
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
			</div>
		</div>
	)
}

export default Recommendation
