import { Box } from '@mui/material';

const Tips = () => (
  <Box
    sx={{
      position: 'absolute',
      top: '16px',
      left: '16px',
      maxWidth: '300px',
      borderRadius: '4px',
      '& h1': {
        fontFamily: 'Good Headline Pro Medium',
        opacity: 0.75
      },
      '& p': {
        fontFamily: 'Good Headline Pro',
        opacity: 0.75,
        marginTop: '12px'
      }
    }}
  >
    <h1>Tips</h1>
    <p>
      Table cells are using markdown, so you can do all kinds of edits, even add
      links.
    </p>
    <p>
      In order to make lists, you can separate list items by prefixing them with
      a dash "-".
    </p>
    <p>
      For example: "<strong>- List item</strong>"
    </p>
    <p>
      For more markdown tips you can visit{' '}
      <a href='https://www.markdownguide.org/basic-syntax/#headings'>
        this link
      </a>
    </p>
  </Box>
);

export default Tips;
