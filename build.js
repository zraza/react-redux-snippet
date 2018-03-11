const fs = require('fs');

const getBodyArray = (bodyStr) => {
  const bodyParts = bodyStr.split('\n');
  if (bodyParts[0].trim() === '') bodyParts.shift();
  const startSpaces = bodyParts[0].search(/\S|$/);
  return bodyParts.map(s => s.substr(startSpaces).replace(/^\s+/, m => m.replace(/\s\s/g, '\t')));
};

const y = [
  {
    prefix: 'rxr',
    description: '',
    body: `
      const initialState = { $1 };
      export default (state = initialState, action) => {
        switch (action.type) {
          case $2:
            $3
          default:
            return state;
        }
      };`
  }
];

const xx = [
  {
    prefix: 'imr',
    description: 'Import React',
    body: `
      import React from 'react';
    `,
  },
  {
    prefix: 'imrc',
    description: 'Import React with Component',
    body: `
      import React, { Component } from 'react';
    `,
  },
  {
    prefix: 'imrpc',
    description: 'Import React with PureComponent',
    body: `
      import React, { PureComponent } from 'react';
    `,
  },
  {
    prefix: 'imrn',
    description: 'Import from React Native',
    body: `
      import { $1 } from 'react-native';
    `,
  },
  {
    prefix: 'ims',
    description: 'Import Styled Components',
    body: `
      import styled from 'styled-components';
    `,
  },
  {
    prefix: 'imsn',
    description: 'Import Styled Components native',
    body: `
    import styled from 'styled-components/native';
    `,
  },
  {
    prefix: 'rct',
    description: 'Create constant',
    body: `
    export const $1 = '$1';
    `
  },
  {
    prefix: 'cl',
    description: 'Log to console',
    body: `
      console.log($1)
    `,
  },
  {
    prefix: 'ed',
    description: 'Export default',
    body: `
      export default $1;
    `,
  },
  {
    prefix: 'edl',
    description: 'Eslint Disable Line',
    body: '// eslint-disable-line',
  },
  {
    prefix: 'cm',
    description: 'Block Comments',
    body: `
      /**
       * ${1}
       */
    `
  },
  {
    prefix: 'sl',
    description: 'Export Stateless Component',
    body: `
      const $1 = () => (
        $2
      )
      export default $1
    `
  },
  {
    prefix: 'slr',
    description: 'Export Stateless Component with Return',
    body: `
      const $1 = () => {
        return (
          $2
        );
      }
      export default $1
    `
  },
  {
    prefix: 'rrd',
    description: 'Export Redux Reducer',
    body: `
      export default (state = $1, action) => {
        switch (action.type) {
          case $2:
            $3
          default:
            return state;
        }
      }
    `
  },
  {
    prefix: 'rpf',
    description: 'Export Redux Pure Function',
    body: `
      export const $1 = '$1';

      export function $2($3) {
        return {
          type: $1,
          $3
        }
      }
    `
  },
  {
    prefix: 'rpc',
    description: 'Redux Pure Function Const',
    body: `
      export const $1 = '$1';

      export const $2 = $3 => ({
        type: $1,
        $3
      })
    `
  },
  {
    prefix: 'cwm',
    description: 'ComponentWillMount',
    body: `
      componentWillMount() {
        $1
      }
    `
  },
  {
    prefix: 'cwu',
    description: 'componentWillUpdate',
    body: `
      componentWillUpdate() {
        $1
      }
    `
  },
  {
    prefix: 'cdu',
    description: 'componentDidUpdate',
    body: `
      componentDidUpdate(prevProps, prevState) {
        $1
      }
    `
  },
  {
    prefix: 'scu',
    description: 'shouldComponentUpdate',
    body: `
      shouldComponentUpdate(nextProps, nextState, nextContext) {
         $1
      }
    `
  },
  {
    prefix: 'cwrp',
    description: 'componentWillReceiveProps',
    body: `
      componentWillReceiveProps(nextProps) {
        $1
      }
    `
  },
  {
    prefix: 'ccs',
    description: 'Component Class',
    body: `
      class $1 extends Component {
        state = { $2 }
        render() {
          return (
            $3
          );
        }
      }
      
      export default $1
    `
  },
  {
    prefix: 'cccs',
    description: 'Component Class With Constructor',
    body: `
      class $1 extends Component {
        constructor(props) {
          super(props);
          this.state = { $2 };
        }
        render() {
          return (
            $3
          );
        }
      }
      
      export default $1
    `
  },
  {
    prefix: 'ccsf',
    description: 'Component Class FlowType',
    body: `
      type P = {
        $1
      };

      type S = {
        $2
      };

      class $3 extends Component<P, S> {
        state = { $4 }
        render() {
          return (
            $5
          );
        }
      }

      export default $3
    `
  },
  {
    prefix: 'pcs',
    description: 'PureComponent Class',
    body: `
      class $1 extends PureComponent {
        state = { $2 }
        render() {
          return (
            $3
          );
        }
      }

      export default $1
    `
  },
  {
    prefix: 'pccs',
    description: 'PureComponent Class With Constructor',
    body: `
      class $1 extends PureComponent {
        constructor(props) {
          super(props);
          this.state = { $2 };
        }
        render() {
          return (
            $3
          );
        }
      }

      export default $1
    `
  },
  {
    prefix: 'pcsf',
    description: 'PureComponent Class FlowType',
    body: `
      type P = {
        $1
      };

      type S = {
        $2
      };

      class $3 extends PureComponent<P, S> {
        state = { $4 }
        render() {
          return (
            $5
          );
        }
      }

      export default $3
    `
  },
  {
    prefix: 'ccsr',
    description: 'Component Class With Redux',
    body: `
      class $1 extends Component {
        state = { $2 }
        render() {
          return (
            $3
          );
        }
      }

      export default connect($4, $5)($1)
    `
  },
  {
    prefix: 'edccs',
    description: 'Export default Component Class',
    body: `
      export default class $1 extends Component {
        state = { $2 }
        render() {
          return (
            $3
          );
        }
      }
    `
  },
  {
    prefix: 'crr',
    description: 'Import Connect Redux',
    body: `
      import { connect } from 'react-redux';
    `
  },
  {
    prefix: 'cdm',
    description: 'componentDidMount',
    body: `
      componentDidMount() {
        $1
      }
    `
  },
  {
    prefix: 'rnss',
    description: '',
    body: `
      const styles = StyleSheet.create({
        $1
      })
    `
  },
  {
    prefix: 'ess',
    description: 'StyleSheet Style',
    body: `
      import EStyleSheet from 'react-native-extended-stylesheet';

      const styles = EStyleSheet.create({
        $1
      });

      export default styles
    `
  },
  {
    prefix: 'slc',
    description: 'Stateless Component Function',
    body: `
      function $1($2) {
        $3
      }

      export default $1
    `
  },
  {
    prefix: 'cwum',
    description: 'componentWillUnmount',
    body: `
      componentWillUnmount() {
        $1
      }
    `
  },
  {
    prefix: 'cdc',
    description: 'componentDidCatch',
    body: `
      componentDidCatch(error, info) {
        $1
      }
    `
  },
  {
    prefix: 'tdesc',
    description: 'Test Describe',
    body: `
      describe('$1', () => {
        $2
      })
    `
  },
  {
    prefix: 'tit',
    description: 'Test it',
    body: `
      it('should $1', $2($3) => {
        $4
      })
    `
  },
  {
    prefix: 'ffm',
    description: '',
    body: '// \\$FlowFixMe'
  }
];

const snippets = {};
xx.forEach((snip) => {
  snippets[snip.prefix] = { ...snip, body: getBodyArray(snip.body), prefix: `ccc${snip.prefix}` };
});

fs.writeFileSync('./snippets/snippets.json', JSON.stringify(snippets));