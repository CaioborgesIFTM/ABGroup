# ABGroup — site reestruturado

Abra index.html no navegador. A landing page da UND está em und.html, acessível pelo header e pelo rodapé da home. Implementação em HTML, CSS e JavaScript puros, sem instalação ou bibliotecas externas. Imagens e fonte estão incluídas localmente.

## Publicação e build

Com Node.js 18 ou superior, execute npm run build. O comando verifica JavaScript, arquivos referenciados, IDs, fontes locais e âncoras entre as duas páginas, e gera a pasta dist/. Publique o conteúdo dessa pasta em um servidor estático.

Esta entrega é independente do Wix, pois o código-fonte do site original não foi fornecido. Nenhuma alteração foi publicada no site de produção. Os contatos abrem os destinos oficiais; não há formulário ou backend simulado.

## Design

Composição reformulada em todas as seções, com tipografia Manrope local, paleta verde da ABGroup e espaçamentos mais compactos. Hero fotográfico com entrada sequenciada, botões com resposta suave e apresentação das áreas de consultoria. O menu centralizado contém Sobre, Soluções, Atuação, Vagas e UND.

- Sobre combina o texto institucional com números em uma grade 2 × 2. Missão e Visão ocupam duas colunas, e Valores tem uma faixa própria.
- Desafios aparecem antes das soluções em cinco linhas inteiramente clicáveis.
- Soluções usa seleção lateral e um único painel no desktop, com listas de serviços em duas colunas. No celular, o mesmo conteúdo vira um acordeão. O painel cresce conforme o conteúdo, sem altura fixa, cortes ou cards vizinhos esticados.
- Clientes mantém a grade de segmentos estável e abre as empresas em um painel abaixo, com seleção destacada e comando para fechar.
- Mapeamento mostra as cinco áreas e seus serviços de uma vez, sem esconder as informações em menus.
- Depoimentos aparecem em linhas com imagem e identificação. RH e Vagas formam um conjunto visual conectado. O contato final ocupa uma faixa verde, seguido do rodapé compacto.
- Entradas suaves, transições de seleção, contagem dos números e efeitos de foco e mouse respeitam movimento reduzido. Não há partículas ou rotação automática do hero.

## Conteúdo e fontes

### UND — Universidade da Distribuição

Página em und.html, com estilos complementares em und.css e o mesmo header, rodapé, fonte, cores e comportamento de navegação da ABGroup. O header da UND retorna às seções da home; a navegação interna do hero dá acesso a Sobre, Palestras, Formação e Área do Aluno.

Textos, logo UND, marca FGL, fotografia do instrutor, 13 logos de instituições e seis programas em PDF foram obtidos de https://www.abgroup.com.br/parceiros. Os cursos preservam suas descrições e abrem os documentos oficiais em nova aba. Os seis documentos foram verificados como PDFs acessíveis. Os números de experiência e alunos do instrutor são os publicados na página UND; os números institucionais da home foram preservados.

O contato da UND usa o WhatsApp publicado nessa página (https://wa.me/5534984148442). Não há formulário com envio simulado; o botão encaminha diretamente ao canal oficial. A Área do Aluno e o perfil do instrutor mantêm seus destinos reais. Fontes, nomes das instituições e URLs dos programas estão registrados em fontes.json.

Validação da UND: imagens locais carregadas, seis cursos, 13 instituições, menu centralizado, ida e volta entre as páginas no desktop e no celular, links internos, fallback sem JavaScript, movimento reduzido, texto ampliado em 200% e larguras de 320 a 1440 px, sem erros de execução.

### ABGroup

- Textos institucionais, soluções, mapeamento, RH, Vagas e imagens: https://www.abgroup.com.br/.
- Título do hero, subtexto, desafios e CTA conforme o pedido do usuário.
- Números preservados: mais de 30 anos, 4.000 projetos, 3.000 clientes e 50 mil alunos.
- 55 logos, organizadas nos 11 segmentos originais. A prévia de cada grupo alterna automaticamente a cada 5 segundos; clicar no segmento exibe suas cinco empresas. Há controle de pausa, e a rotação pausa fora da tela ou com a página oculta. Segmentos abertos não alternam.
- Os dois depoimentos reais (Clair Dalberto e Tácio Greco) mantêm imagem, nome, cargo e acesso à seção oficial. O Wix retornou erro para reprodução direta dos arquivos, portanto os cards abrem a página original; não foram inventadas falas ou transcrições.
- Serviços de RH preservados: Recrutamento e Seleção de Executivos; Análise de Perfil Comportamental; Treinamento; Desenvolvimento de Lideranças; Estruturação de Cargos e Salários.
- Vagas utiliza a imagem e o texto oficiais e direciona a https://abgroup.vagas.solides.com.br/.
- WhatsApp e redes sociais preservam os endereços publicados no site, inclusive os dígitos originais do contato.
- Fontes e arquivos de origem constam em fontes.json. Manrope usa SIL Open Font License; cópia em assets/manrope-license.txt.

## Acessibilidade e validação

Navegação por teclado, foco visível, menu com estado acessível e fechamento por Escape, conteúdo funcional sem JavaScript e suporte a movimento reduzido. Soluções permite seleção pelas setas, Home e End no desktop, além de links diretos para cada área. Os números animam uma vez, preservando os valores finais e os rótulos acessíveis.

Validações: build sem erros, imagens carregadas, fonte local, navegação móvel, âncoras, seleção de soluções e clientes, rotação aos 5.000 ms, pausa, texto ampliado em 200%, larguras de 320 a 1440 px e ausência de erros de execução no navegador. Revisão de conteúdo confirmou a preservação dos textos institucionais, das 35 ofertas nas quatro soluções, das 55 logos, das cinco áreas de mapeamento, dos cinco serviços de RH e dos contatos oficiais.
