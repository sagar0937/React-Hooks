import React, { useState, useEffect, useRef } from 'react'
import { Form } from 'react-bootstrap'

export default function Search() {

    // SET INITIAL STATE FOR query AND jokes
    // CREATE REF FOR SEARCH INPUT
    // THIS ORDER MATTERS
    const [query, setQuery] = useState('')
    const [jokes, setJokes] = useState([])
    const focusSearch = useRef(null)

    // useEffect - FOCUS ON SEARCH INPUT
    useEffect(() => {focusSearch.current.focus()}, [])

    // FETCH API DATA
    const getJokes = async (query) => {
        const results = await fetch(`https://icanhazdadjoke.com/search?term=${query}`, {
            headers: {'accept': 'application/json'}
        })
        const jokesData = await results.json()
        return jokesData.results
    }

    // PREVENTS RERENDER FLICKERING AS USER TYPES IN SEARCH
    const sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    // useEffect - ONLY RERENDERS WHEN query IS CHANGED
    useEffect(() => {
        let currentQuery = true
        const controller = new AbortController()

        const loadJokes = async () => {
            if (!query) return setJokes([])

            await sleep(350) 
            if (currentQuery) {
                const jokes = await getJokes(query, controller)
                setJokes(jokes)
            }
        }
        loadJokes()

        return () => {
            currentQuery = false
            controller.abort()
        }
    }, [query])

    // RENDER JOKES 
    let jokeComponents = jokes.map((joke, index) => {
        return <li key={index}>{joke.joke}</li> 
    })

    // RENDER COMPONENT
    return (
        <>
        <Form id="search-form">
            <Form.Control 
                type="email" 
                placeholder="Search for a Joke..." 
                ref={focusSearch}
                onChange={(e) => setQuery(e.target.value)}
                value={query} 
            />
        </Form>

        <div id="jokes-list">
            <ul>
                {jokeComponents}
            </ul>
        </div>
        </>
    )
}