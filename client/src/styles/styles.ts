import { createGlobalStyle } from "styled-components";

export const Styles = createGlobalStyle`

    @font-face {
        font-style: normal;
    }

    @font-face {
        font-style: normal;
    }


    body,
    html,
    a {
        font-family: 'Motiva Sans Light', sans-serif;
    }


    body {
        margin:0;
        padding:0;
        border: 0;
        outline: 0;
        overflow-x: hidden;
    }

    a:hover {
        // color: #fff;
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
        font-family: 'Motiva Sans Bold', serif;
        font-size: 56px;
        line-height: 1.18;

        @media only screen and (max-width: 890px) {
          font-size: 47px;
        }
      
        @media only screen and (max-width: 414px) {
          font-size: 32px;
        }
    }

    p {
        font-size: 21px;        
        line-height: 1.41;
    }

    .link {
        text-decoration: underline;
    }

    .question-answer-container {
        border-radius: 16px;
        margin-bottom: 1rem;
        margin-top: 1rem;
        white-space: pre-line;
        letter-spacing: .1rem;
        margin: 1rem;
        padding: 2rem;
        padding-top: 1.5rem;
    }
    
    .link {
        color: #0b296a;
        &:hover {
            color: #0b296a;
            text-decoration: underline;
            cursor: pointer;
        }
    }

    h1 {
        font-weight: 600;
    }

    .StripeFormGroup {
        margin: 0 15px 20px;
        padding: 0;
        border-style: none;
        background-color: #7795f8;
        will-change: opacity, transform;
        box-shadow: 0 6px 9px rgba(50, 50, 93, 0.06), 0 2px 5px rgba(0, 0, 0, 0.08), inset 0 1px 0 #829fff;
        border-radius: 4px;
    }
    
    .StripeFormRow {
        display: -ms-flexbox;
        display: flex;
        -ms-flex-align: center;
        align-items: center;
        margin-left: 15px;
        border-top: 1px solid #819efc;
    }
    
    .StripeElement--webkit-autofill {
        background: transparent !important;
    }
    
    .StripeElement {
        width: 100%;
        padding: 11px 15px 11px 0;
    }

`;
