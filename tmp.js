return lists.map(l => {
    return {
        name: l.name, 
        videos: 
            videos  
                .filter(v => l.id === v.listId)
                .concatMap( v => { 
                    return Array.zip(
                        boxarts 
                            .filter(ba => v.id == ba.videoId)
                            .reduce((a,c)=>{
                                return a.width * a.height < c.width * c.height ? a : c;
                            }),
                        bookmarks.filter(bm => v.id === bm.videoId), 
                        (ba, bm) => {
                            return {
                                id: v.id,
                                title: v.title, 
                                time: bm.time,
                                boxart: ba.url
                            }
                        }
                    )
                    })
        }
});