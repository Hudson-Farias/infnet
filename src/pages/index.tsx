import type { GetStaticProps } from 'next'
import { useState, useEffect, ChangeEvent } from 'react'

import { Parties, Party, Parliamentarians } from '../interfaces/types'

// Crie uma interface que permita selecionar um partido político em uma caixa de seleção e, ao selecioná-lo, 
// exiba os dados de todos os seus parlamentares da atual legislatura, em uma SPA (single page application).

export default function Home({ parties }: {parties: Parties}) {
  const [party, setParty] = useState<Party>({})
  const [parliamentarians, setParliamentarians] = useState<Parliamentarians | []>([])

  const selected = async (event: ChangeEvent<HTMLSelectElement>) => {
    const partyGet = await fetch(event.target.value)
    const partyData = await partyGet.json()

    setParty(partyData)
  }
    
  useEffect( () => {
    const queryParty = async () => {
      if ('dados' in party){
        const uri = party.dados ? party.dados.status.uriMembros : 'https://dadosabertos.camara.leg.br/api/v2/deputados?idLegislatura=56&siglaPartido=AVANTE34';
        const parliamentariansGet = await fetch(uri)
        const parliamentariansData = await parliamentariansGet.json()
        
        setParliamentarians(parliamentariansData['dados'])
      }}

  queryParty()}, [party])
    
  return (
    <div>
      <label htmlFor="parties">Selecione um partido político: </label>
      <select name="parties" id="parties" onChange={selected}>
        {parties.map(political => { return (
          <option value={political.uri} key={political.id}>{political.nome}</option>
        )})}
      </select>

      <ul>
          {parliamentarians && parliamentarians.map(parliamentarian => { return (
            <li key={parliamentarian.id}>
              <img src={parliamentarian.urlFoto} alt={`${parliamentarian.nome}-image`} />
              <section>
                <span>{parliamentarian.nome}</span>
                <p>{parliamentarian.siglaPartido}</p>
                <p>{parliamentarian.siglaUf}</p>
              </section>
            </li>
          )})}
      </ul>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const partiesGet = await fetch('https://dadosabertos.camara.leg.br/api/v2/partidos')
  const partiesData = await partiesGet.json()

  return {
    props: {
      parties: partiesData['dados']
    }
  }
}