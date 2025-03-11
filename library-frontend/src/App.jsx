/** @format */

import { useEffect, useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import { useApolloClient, useQuery, useSubscription } from '@apollo/client'
import Recommendation from './components/Recommendation'
import { ALL_BOOKS, BOOK_ADDED, ME } from './queries'

// eslint-disable-next-line react-refresh/only-export-components
export const updateCache = (cache, query, addedBook) => {
	const uniqByName = (a) => {
		let seen = new Set()
		return a.filter((item) => {
			let k = item.name
			return seen.has(k) ? false : seen.add(k)
		})
	}

	cache.updateQuery(query, ({ allBooks }) => {
		return {
			allBooks: uniqByName(allBooks.concat(addedBook)),
		}
	})
}

const App = () => {
	const [token, setToken] = useState(null)
	const [page, setPage] = useState('loginForm')
	const [favGenre, setFavGenre] = useState(null)

	const client = useApolloClient()

	const result = useQuery(ME)
	console.log(result)
	useEffect(() => {
		if (result.data) {
			if (result.data.me !== null) {
				setFavGenre(result.data.me.favouriteGenre)
			}
		}
	}, [result.data])

	useSubscription(BOOK_ADDED, {
		onData: ({ data, client }) => {
			const addedBook = data.data.bookAdded
			alert(`${addedBook.title} added`)
			updateCache(client.cache, { query: ALL_BOOKS }, addedBook)
		},
	})

	const logout = () => {
		setToken(null)
		setFavGenre(null)
		localStorage.clear()
		client.resetStore()
	}

	return (
		<div>
			<div>
				<button onClick={() => setPage('authors')}>authors</button>
				<button onClick={() => setPage('books')}>books</button>
				{!token && <button onClick={() => setPage('loginForm')}>login</button>}

				{token && (
					<>
						<button onClick={() => setPage('add')}>add book</button>
						<button onClick={() => setPage('recommend')}>recommend</button>
						<button onClick={logout}>logout</button>
					</>
				)}
			</div>

			<Authors show={page === 'authors'} />
			<Books show={page === 'books'} />
			<NewBook show={page === 'add'} />
			<Recommendation show={page === 'recommend'} favGenre={favGenre} />
			<LoginForm
				show={page === 'loginForm'}
				setPage={setPage}
				setToken={setToken}
			/>
		</div>
	)
}

export default App
