module.exports = {
  title: "Test with composed body",
  slug: "test-with-composed-body",
  contentType: "article",
  flags: [],
  body: [
    {
      type: "image",
      image:
        "https://www.ersnet.org/assets/preview?node=ef19ecbf4da6738232ad&name=img500&size=500&v=12:3456"
    },
    { type: "paragraph", paragraph: "This is a paragraph of text" },
    {
      type: "image",
      image:
        "https://www.ersnet.org/assets/preview?node=4106469bed49b1dcd20d&name=img500&size=500&v=12:3456"
    },
    {
      type: "blockquote",
      blockquote: {
        quote: "This is a quote from Someone",
        author: "I did write it"
      }
    },
    { type: "text", text: "* test\n* test 2\n* test 3" },
    {
      type: "document",
      document:
        "https://www.ersnet.org/assets/static?node=4106469bed49b1dcd20d&v=12:3456"
    }
  ],
  articleOneColumn: true,
  itemImageAlignment: "center",
  itemImageBackgroundSize: "cover",
  imageSize: "small",
  imageAlignment: "center",
  availableOnHomepage: "false",
  loc: {},
  _doc: "1f9e971dd7451b5d6434",
  _qname: "o:1f9e971dd7451b5d6434",
  _features: {
    "f:audit": {},
    "f:titled": {},
    "f:filename": { filename: "Test_with_composed_body" },
    "f:geolocation": {},
    "f:indexable": {},
    "ers:diseases": { enabled: true },
    "ers:methods": { enabled: true },
    "ers:doi": { enabled: true },
    "ers:members-only": { enabled: true },
    "ers:canonical": { enabled: true },
    "ers:isPublished": { enabled: true }
  },
  _type: "ers:article-test",
  _is_association: false
};
