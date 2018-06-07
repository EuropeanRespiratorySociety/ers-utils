module.exports = {
  title: "Test with composed body",
  slug: "test-with-composed-body",
  contentType: "article",
  flags: [],
  body: [
    {
      type: "image",
      image: {
        'id': 'ef19ecbf4da6738232ad',
        'ref': 'node://18dbd4f08d5f428ba9c2/d8e520e996e0be2ab84e/cbe07f08c8d5183934cb/ef19ecbf4da6738232ad',
        'title': 'git.png',
        'qname': 'o:ef19ecbf4da6738232ad',
        'typeQName': 'n:node'
      }
    },
    { type: 'paragraph', paragraph: 'This is a paragraph of text' },
    {
      type: 'image',
      image: {
        'id': '4106469bed49b1dcd20d',
        'ref': 'node://18dbd4f08d5f428ba9c2/d8e520e996e0be2ab84e/cbe07f08c8d5183934cb/4106469bed49b1dcd20d',
        'title': 'docker.png',
        'qname': 'o:4106469bed49b1dcd20d',
        'typeQName': 'n:node'
      }
    },
    {
      type: 'blockquote',
      blockquote: {
        quote: 'This is a quote from Someone',
        author: 'I did write it'
      }
    },
    { type: 'text', text: '* test\n* test 2\n* test 3' },
    {
      type: 'document',
      document:{
        'id': '4106469bed49b1dcd20d',
        'ref': 'node://18dbd4f08d5f428ba9c2/d8e520e996e0be2ab84e/cbe07f08c8d5183934cb/4106469bed49b1dcd20d',
        'title': 'Supposedly a doc',
        'qname': 'o:4106469bed49b1dcd20d',
        'typeQName': 'n:node'
      }
    }
  ],
  articleOneColumn: true,
  itemImageAlignment: 'center',
  itemImageBackgroundSize: 'cover',
  imageSize: 'small',
  imageAlignment: 'center',
  availableOnHomepage: 'false',
  loc: {},
  _doc: '1f9e971dd7451b5d6434',
  _qname: 'o:1f9e971dd7451b5d6434',
  _features: {
    'f:audit': {},
    'f:titled': {},
    'f:filename': { filename: 'Test_with_composed_body' },
    'f:geolocation': {},
    'f:indexable': {},
    'ers:diseases': { enabled: true },
    'ers:methods': { enabled: true },
    'ers:doi': { enabled: true },
    'ers:members-only': { enabled: true },
    'ers:canonical': { enabled: true },
    'ers:isPublished': { enabled: true }
  },
  _type: 'ers:article-test',
  _is_association: false
};
