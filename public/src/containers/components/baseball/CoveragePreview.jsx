import React from 'react';
import styled from 'styled-components';

// import { FacebookIcon, TwitterIcon } from '../Icons';
// import media from 'containers/components/Media';
// import { TabletOnly, MobileOnly } from '../Layout';

const Wrapper = styled.div`
  display: flex;
`

// const Title = styled.div`
//   font-size: 29px;
//   line-height: 35px;
//   font-weight: bold;
//   margin-bottom: 15px;
// `

const NotAvailable = styled.div`
  text-align: center;
  font-size: 29px;
  line-height: 35px;
  font-weight: bold;
  margin-bottom: 15px;
  padding: 100px 10px;
`

// const Press = styled.div`
//   font-size: 16px;
//   line-height: 19px;
//   font-weight: 600;
//   margin-bottom: 4px;
// `

// const Date = styled.div`
//   font-size: 12px;
//   line-height: 14px;
//   margin-bottom: 23px;
// `

// const Text = styled.div`
//   p {
//     font-size: 17px;
//     line-height: 20px;
//     margin-bottom: 15px;
//   }
// `

const Content = styled.div`
  flex: 1 0 1px;
`

// const SocialHolder = styled.div`
//   display: flex;

//   ${media.tablet} {
//     display: block;
//     margin-right: 20px;
//   }
// `

// const SocialIcon = styled.div`
//   margin-left: 14px;

//   ${media.tablet} {
//     margin-left: 0;
//     margin-bottom: 20px;
//   }
// `

// const SubHolder = styled.div`
//   display: flex;
//   justify-content: space-between;
// `

function CoveragePreview(props) {
  return (
    <Wrapper>
      {/* <TabletOnly>
        <SocialHolder>
          <SocialIcon>
            <FacebookIcon />
          </SocialIcon>
          <TwitterIcon />
        </SocialHolder>
      </TabletOnly> */}
      <Content>
        <NotAvailable>Not available for this game</NotAvailable>
        {/* <Title>Mets’ Matz hopes to continue success against Braves</Title>
        <SubHolder>
          <div>
            <Press>Associated Press</Press>
            <Date>May 29, 2018 2:14am ET</Date>
          </div>
          <MobileOnly>
            <SocialHolder>
              <TwitterIcon />
              <SocialIcon>
                <FacebookIcon />
              </SocialIcon>
            </SocialHolder>
          </MobileOnly>
        </SubHolder>
        <Text>
          <p>The New York Mets hope left-hander Steven Matz will continue his upward track and maintain his long-time trend against the Atlanta Braves.</p>
          <p>Matz (2-3, 3.80) will start for New York on Tuesday against Atlanta’s Anibal Sanchez (1-0, 1.29) in the third game of a four-game series at Atlanta’s SunTrust Park.</p>
          <p>The teams split a double-header on Monday, the Braves winning the first game and the Mets taking the nightcap, which didn’t end until 1:30 a.m. due to a two hour and 57-minute rain delay.</p>
          <p>Matz has limited the opposition to one or fewer runs in three of his four starts in May. In his last outing on May 24, Matz fired six scoreless innings and allowed four hits in six innings. It was his longest stint of the season.</p>
        </Text> */}
      </Content>
    </Wrapper>
  )
}

export default CoveragePreview;
