import { useState } from 'react'

export const useObjectState = initialState => {
    const [state, setState] = useState(initialState)
    return [state, state => setState(prevState => ({ ...prevState, ...state }))]
}