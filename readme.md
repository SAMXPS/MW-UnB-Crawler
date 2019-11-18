# UnB/Matrícula-Web Crawler 

No período de recesso entre o primeiro e segundo semestre de 2019, eu estava com algumas ideias de projetos para aprender javascript e node.js. Dentre essas ideias, decidi começar a implementar um crawler para o matrícula web, que baixaria dados das disciplinas e montaria um esquema interativo em JS/HTML das matérias, assim como a dependência entre as mesmas. Dessa forma, os alunos poderiam ver outras opções de fluxo a seguir, de forma a cursar as matérias desejadas.

Vejamos, agora, uma breve introdução (super simplificada) a respeito de o que são crawlers, para que servem e como utilizam da sintaxe HTML/JavaScript/CSS para extrair dados.

> Nota: este documento ainda está longe de ficar pronto, assim como o projeto. Então, quem quiser ajudar, sinta-se à vontade! 

## O que é um crawler? 

Um crawler é basicamente um programa que acessa páginas web e extrai dados diversos das mesmas, seja para pesquisas, indexamento de páginas, processamento de dados, etc. No caso desse projeto, o crawler desenvolvido irá baixar as informações dos cursos, via matricula-web, e transformá-los em arquivos JSON, de fácil uso.

## Como conseguir dados de uma página web?

O primeiro passo de conseguir dados de uma página, obviamente, é conectar-se a ela. Para isso, iniciaremos uma conexão TCP em formato de requisição HTTP para o servidor desejado. Depois disso, o servidor responderá com o código-fonte da página em HTML. Assim, precisamos processar o HTML recebido a fim de extrair dados.

## Sintaxe HTML, divs, tags (for dummies)

Um arquivo/resposta HTML é uma estrutura de tags em texto que dizem para o navegador(browser) como mostrar a página na tela do computador. Essas tags são abertas entre <> e fechadas entre os caracteres </>, ou seja: 
```HTML
<tag> </tag>
```
Um exemplo de página simples html:
```HTML
<HTML>
    <body>
        <p> Hello World </p>
    </body>
</HTML>
```

### ID's e classes no HTML

Os elementos em um documento HTML podem ter algumas características atreladas a eles como, por exemplo, IDs, classes e estilização. 

Um ID é uma String de identificação única do elemento dentro do documento. O ID pode ser utilizado, por exemplo, dentro de um código JavaScript para acessar esse elemento e alterar propriedades dele ou, ainda, ser utilizado pela estilização CSS para alterar a forma com que o elemento é mostrado na tela.

Vejamos, por exemplo, uma div com o id "MINHA_DIV" sendo definida:

```HTML
<HTML>
    <body>
        <p> Hello World </p>
        <div id="MINHA_DIV">conteúdo da div</div>
    </body>
</HTML>
```

Além dos ID's, os elementos podem ter classes. As classes, como o nome já sugere, são categorias de elementos que podem ser repetidos várias vezes dentro do mesmo documento e, dessa forma, vão ter características semelhantes entre si. Dessa forma, é possível criar, por exemplo, uma classe de páragrafo formatado e utilizar uma estilização CSS para todos os elementos que seguirem essa classe:

```HTML
<HTML>
    <style>
        /* A tag <style> abre um escopo de estilização CSS dentro do documento HTML*/

        /* Declarando a estilização da classe my_paragraph */
        .my_paragraph {
            text-align: justify; /* Alinha o texto de forma justificada*/
        }

    </style>

    <body>
        <div>
            <p> Este é um parágrafo comum. </p>
            <p class="my_paragraph"> Este é o meu parágrafo estilizado de forma justificada, ou seja, o texto ocupará todo o espaço disponível, assim como em alguns trabalhos da escola. </p>
        </div>
    </body>
</HTML>
```

### Usando tags, ID's e classes para extrair dados de uma resposta HTML

Quando você abre uma página no navegador, uma resposta em texto HTTP é enviada do servido que você está acessando até o seu computador. Essa resposta, na maioria das vezes, é dada em formato HTML. Assim, podemos usar a sintaxe do HTML para achar coisas dentro da página de forma fácil, usando APIs prontas, contruídas em JS, Python ou linguagem preferida. No caso deste crawler, estaremos usando uma biblioteca baseada em JQuery feita para o Node.JS, chamada cheerio. 


