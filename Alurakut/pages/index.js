import React from 'react';
import MainGrid from '../src/components/MainGrid';
import Box from '../src/components/Box';
import {AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet} from '../src/lib/AlurakutCommons';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';

function ProfileSidebar(propriedades){
  return(
    <Box as="aside">
      <img src={`https://github.com/${propriedades.githubUser}.png`} style={{borderRadius: '8px'}} />
      <hr/>
      <p>
        <a className="boxLink"  href={`https://github.com/${propriedades.githubUser}`} > 
        @{propriedades.githubUser}
        </a>
      </p>
      
      <hr/>

      <AlurakutProfileSidebarMenuDefault />
    </Box>
  )
}

function ProfileRelationsBox(props){
  return (
    <ProfileRelationsBoxWrapper>
    <h2 className="smallTitle">
      {props.title} ({props.items.length})
    </h2>
    
    <ul>
      {props.items.slice(0,6).map((itemAtual) => {
        console.log(itemAtual);
        return (
          <li key={itemAtual.id}> 
           <a
                  href={`https://github.com/${itemAtual.login}`}
                  key={itemAtual.id}
                >
                  <img src={`https://github.com/${itemAtual.login}.png`} />
                  <span>{itemAtual.login}</span>
                </a>
              </li>
            );
          })}
    </ul>  
  </ProfileRelationsBoxWrapper>
  )
}
export default function Home() {
React.useState(['Alurakut']);
const usuarioAleatorio = 'rayanne-barros'; 
const [comunidades, setComunidades] = React.useState([{
    id: '123456789123',
    title: 'Eu odeio acordar cedo',
    image: 'https://alurakut.vercel.app/capa-comunidade-01.jpg'
    
}]);

// const comunidades = ['Alurakut']
const pessoasFavoritas = [
  'juunegreiros',
  'omariosouto',
  'peas',
  'rafaballerini',
  'marcobrunodev',
  'felipefialho',
  'Lucasedqnunes'
]

const [seguidores, setSeguidores] = React.useState([]); 
React.useEffect(function() {
  fetch('https://api.github.com/users/rayanne-barros/followers')
  .then(function(respostaDoServidor){
    return respostaDoServidor.json();
  })
  .then(function(respostaCompleta){
    setSeguidores(respostaCompleta);
  })

}, [])

console.log('seguidores antes do return', seguidores);

  return (
    <>
      <AlurakutMenu githubUser={usuarioAleatorio}/>
      <MainGrid>
        <div className="profileArea" style={{gridArea: 'profileArea'}}>
          <ProfileSidebar githubUser={usuarioAleatorio} />
        </div>

        <div className="welcomeArea" style={{gridArea: 'welcomeArea'}}>
            <Box >
              <h1 className="title">
                Bem vindo(a)
              </h1>
              <OrkutNostalgicIconSet />
              </Box>
              <Box>
                <h2 className="subTitle"> O que você deseja fazer? </h2>
                <form onSubmit={function handleSubmit(e){
                    e.preventDefault();
                    const dadosDoForm = new FormData(e.target);

                    console.log('Campo: ', dadosDoForm.get('title'));
                    console.log('Campo: ', dadosDoForm.get('image'));
                   
                    const comunidade = {
                      id: new Date().toISOString(),
                      title: dadosDoForm.get('title'),
                      image: dadosDoForm.get('image')                      
                    }
                    //comunidades.push('Alura Stars');
                    const comunidadesAtualizadas = [...comunidades, comunidade];
                    setComunidades(comunidadesAtualizadas)
                  }}>
                  <div>
                    <input
                       placeholder="Qual o nome da sua comunidade?" name="title" aria-label="Qual o nome da sua comunidade?" type="text" 
                    />
                  </div>

                  <div>
                    <input
                       placeholder="Coloque uma URL para usarmos de capa" name="image" aria-label="Coloque uma URL para usarmos de capa"
                    />
                  </div>
                  
                  <button>
                    Criar comunidade
                  </button>
                  
                </form>
              </Box> 
        </div>
        
        <div className="profileRelationsArea" style={{gridArea: 'profileRelationsArea'}}>

            <ProfileRelationsBox title="Seguidores" items={seguidores} />         
            <ProfileRelationsBoxWrapper>
              <h2 className="smallTitle">
                Pessoas da Comunidade ({pessoasFavoritas.length})
              </h2>
              
              <ul>
                {pessoasFavoritas.slice(0,6).map((itemAtual) => {
                  return (
                    <li key={itemAtual}> 
                      <a href={`/users/${itemAtual}`} >
                        <img src={`https://github.com/${itemAtual}.png`} />
                        <span>{itemAtual}</span>
                      </a>
                    </li>
                  )
                })}
              </ul>             

            </ProfileRelationsBoxWrapper>
            <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
                Comunidades ({comunidades.length})
              </h2>
              <ul>
                  {comunidades.map((itemAtual) => {
                    return (
                      <li key={itemAtual.id}> 
                        <a href={`/users/${itemAtual.title}`} >
                           <img src={itemAtual.image} /> 
                          <span>{itemAtual.title}</span>
                        </a>
                      </li>
                    )
                  })}
                </ul>             

            </ProfileRelationsBoxWrapper>
        </div>     
      
      </MainGrid>
    </>
  )
}
