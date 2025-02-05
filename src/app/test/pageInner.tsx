const PageInner = ({data}: {data: {title: string,description: string,cover:string}[]}) => {
  return (
    data && data.map((post: {title: string,description: string,cover:string}) => (
      <div key={post.title}>
        <h1>{post.title}</h1>
        <p dangerouslySetInnerHTML={{ __html: post.description }}></p>
        <img src={post.cover} alt={post.title} />
      </div>
    ))
  )
}

export default PageInner