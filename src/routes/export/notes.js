const {
    Document,
    Paragraph,
    HeadingLevel,
    TextRun,
    ExternalHyperlink,
    Packer
  } = require('docx')
  const { htmlToDocxObject } = require('html-to-docx')

  let docxExport

  const extractChildren = (children, fontSize) => {
    return children.map(child => {
      if (child.link) {
        return new ExternalHyperlink({
          child: new TextRun({
            text: child.text,
            bold: child.bold,
            italics: child.italics,
            size: fontSize,
            underline: { type: 'single' }
          }),
          link: child.link
        })
      } else {
        return new TextRun({
          text: child.text,
          bold: child.bold,
          italics: child.italics,
          size: fontSize
        })
      }
    })
  }
  
  let sources = []
  const children = []

  
  const listToDocx = list => {

    list.items.forEach(note => {
      // save source
      if (note.source) sources.push(note.source)

        note.body.forEach(body => {

          if (body.motivation === 'highlighting') {
              body.content = `Highlight: ${body.content}`
          } else {
              body.content = `Note: ${body.content}`
          }

          let paragraphs = htmlToDocxObject(body.content)
          let fontSize = 24
  
          paragraphs.forEach(paragraph => {
            if (paragraph.paragraphType === 'bullet') {
              children.push(
                new Paragraph({
                  children: extractChildren(paragraph.sections, fontSize),
                  bullet: {
                    level: 1
                  }
                })
              )
            } else if (
              paragraph.paragraphType === 'quote' ||
              body.motivation === 'highlighting'
            ) {
              children.push(
                new Paragraph({
                  children: extractChildren(paragraph.sections, fontSize),
                //   indent: {
                //     left: 300,
                //     right: 300
                //   }
                })
              )
              children.push(new Paragraph({text: ''}))
            } else {
              children.push(
                new Paragraph({
                  children: extractChildren(paragraph.sections, fontSize)
                })
              )
              children.push(new Paragraph({text: ''}))
            }
          })
  
          if (note.source) {
            if (body.motivation === 'highlighting' || note.body.length === 1) {
              children.push(
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `Source: ${note.source.name}`,
                    //   font: 'Calibri',
                    //   size: 18
                    })
                  ]
                })
              )
            }
          }
        })
        if (note.json && note.json.pages) {
          children.push(new Paragraph({ text: `Page number: ${note.json.pages}` }))
        }
        children.push(new Paragraph({ text: '' }))
        children.push(
          new Paragraph({
            text: '*****'
          })
        )
      
    })
  
    if (sources.length) {
      sources = sources.map(source => source.name)
      sources = [... new Set(sources)]

      children.push(
        new Paragraph({
          text: 'Source List',
          heading: HeadingLevel.HEADING_1
        })
      )
      sources.forEach(source => {
        children.push(
          new Paragraph({
            text: source,
            bullet: {
              level: 1
            }
          })
        )
      })
    }
  
    const notesDoc = new Document({
      title: 'notes export',
      sections: [
        {
          children: children
        }
      ]
    })
    return notesDoc
  }



  export async function post(req, res, next) {

    docxExport = listToDocx(req.body)

    res.send()

  }

  export async function get(req, res) {
    const b64string = await Packer.toBase64String(docxExport)

    res.set(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    )
    res.set(
      'Content-Disposition',
      `attachment; filename=notesExport.docx`
    )
    res.send(Buffer.from(b64string, 'base64'))


  }