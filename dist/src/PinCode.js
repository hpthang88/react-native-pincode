'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const React = require('react');
const react_native_1 = require('react-native');
const react_native_easy_grid_1 = require('react-native-easy-grid');
const grid_1 = require('./design/grid');
const colors_1 = require('./design/colors');
const MaterialIcons_1 = require('react-native-vector-icons/MaterialIcons');
const _ = require('lodash');
const Animate_1 = require('react-move/Animate');
const d3_ease_1 = require('d3-ease');
const delay_1 = require('./delay');

const mainColor = 'green';
const deleteColor = '#d3d3d3';
const deleteHighlightColor = 'tomato';

var PinStatus;
(function(PinStatus) {
  PinStatus['choose'] = 'choose';
  PinStatus['confirm'] = 'confirm';
  PinStatus['enter'] = 'enter';
})((PinStatus = exports.PinStatus || (exports.PinStatus = {})));
const textDeleteAllButtonDefault = 'Clear';
class PinCode extends React.PureComponent {
  constructor(props) {
    super(props);
    this.failedAttempt = async () => {
      this.setState({ changeScreen: true });
      await delay_1.default(300);
      this.setState({
        showError: true,
        attemptFailed: true,
        changeScreen: false,
        password: ''
      });
      this.doShake();
    };
    this.newAttempt = async () => {
      this.setState({ changeScreen: true });
      await delay_1.default(200);
      this.setState({
        changeScreen: false,
        showError: false,
        attemptFailed: false
      });
    };

    this.onPressButtonNumber = async text => {
      if (this.state.showError && this.state.attemptFailed) this.newAttempt();
      const currentPassword = this.state.password + text;
      this.setState({ password: currentPassword });
      if (this.props.getCurrentLength) {
        this.props.getCurrentLength(currentPassword.length);
      }
    };

    this.renderButtonNumber = text => {
      const disabled =
        (this.state.password.length === this.props.passwordLength || this.state.showError) &&
        !this.state.attemptFailed;
      return React.createElement(
        react_native_1.TouchableOpacity,
        {
          key: text,
          style: [
            styles.buttonCircle,
            this.state.currentButtonPressed === text && {
              backgroundColor: mainColor
            }
          ],
          disabled: disabled,
          onPressIn: () => this.setState({ currentButtonPressed: text }),
          onPressOut: () => this.setState({ currentButtonPressed: undefined }),
          onPress: () => {
            this.onPressButtonNumber(text);
          }
        },
        React.createElement(
          react_native_1.Text,
          {
            style: [
              styles.text,
              this.props.styleTextButton,
              {
                color: this.state.currentButtonPressed === text ? '#fff' : colors_1.colors.grey
              }
            ]
          },
          text
        )
      );
    };
    this.endProcess = pwd => {
      setTimeout(() => {
        this.setState({ changeScreen: true });
        setTimeout(() => {
          // this.props.endProcess(pwd);
        }, 100);
      }, 100);
    };

    this.renderCirclePassword = () => {
      const { password, showError, changeScreen, attemptFailed } = this.state;
      const { colorPassword } = this.props;

      return React.createElement(
        react_native_1.View,
        {
          key: `key-${index}`,
          style: this.props.styleCircleHiddenPassword
            ? this.props.styleCircleHiddenPassword
            : styles.topViewCirclePassword
        },
        _.range(this.props.passwordLength).map(val => {
          const lengthSup =
            ((password.length >= val + 1 && !changeScreen) || showError) && !attemptFailed;
          const backgroundColor = !lengthSup ? 'transparent' : colorPassword || mainColor;
          return React.createElement(
            react_native_1.View,
            {
              style: {
                width: this._circleSizeFull,
                height: this._circleSizeFull,
                marginHorizontal: this._circleSizeFull,
                justifyContent: 'center',
                alignItems: 'center'
              }
            },
            React.createElement(react_native_1.View, {
              style: {
                width: this._circleSizeFull,
                height: this._circleSizeFull,
                borderRadius: this._circleSizeFull / 2,
                borderColor: colorPassword || mainColor,
                borderWidth: 1,
                backgroundColor
              }
            })
          );
        })
      );
    };

    this.renderButtonDelete = opacity => {
      return React.createElement(
        react_native_1.TouchableOpacity,
        {
          disabled: this.state.password.length === 0,
          onPressOut: () => {
            this.setState({
              currentButtonPressed: undefined
            });
          },
          onPressIn: () => {
            this.setState({
              currentButtonPressed: 'delete'
            });
          },
          onPress: () => {
            if (this.state.password.length > 0) {
              const newPass = this.state.password.slice(0, -1);
              this.setState({ password: newPass });
              if (this.props.getCurrentLength) {
                this.props.getCurrentLength(newPass.length);
              }
            }
          }
        },
        React.createElement(
          react_native_1.View,
          {
            style: this.props.styleColumnDeleteButton
              ? this.props.styleColumnDeleteButton
              : styles.colIcon
          },
          !this.props.iconButtonDeleteDisabled &&
            React.createElement(MaterialIcons_1.default, {
              name: this.props.styleDeleteButtonIcon
                ? this.props.styleDeleteButtonIcon
                : 'backspace',
              size: this.props.styleDeleteButtonSize ? this.props.styleDeleteButtonSize : 30,
              color: this.props.buttonDeleteColor
                ? this.props.buttonDeleteColor
                : this.state.currentButtonPressed === 'delete'
                  ? deleteHighlightColor
                  : deleteColor
            })
        )
      );
    };

    this.renderButtonDeleteAll = opacity => {
      return React.createElement(
        react_native_1.TouchableOpacity,
        {
          disabled: this.state.password.length === 0,
          onPressOut: () => {
            this.setState({
              currentButtonPressed: undefined
            });
          },
          onPressIn: () =>
            this.setState({
              currentButtonPressed: 'all'
            }),
          onPress: () => {
            if (this.state.password.length > 0) {
              this.setState({ password: '' });
              if (this.props.getCurrentLength) this.props.getCurrentLength(0);
            }
          }
        },
        React.createElement(
          react_native_1.View,
          {
            style: this.props.styleColumnDeleteAllButton
              ? this.props.styleColumnDeleteAllButton
              : styles.colIcon
          },
          React.createElement(
            react_native_1.Text,
            {
              style: [
                this.props.styleDeleteAllButtonText
                  ? this.props.styleDeleteAllButtonText
                  : styles.textDeleteButton,
                {
                  color:
                    this.state.currentButtonPressed === 'all' ? deleteHighlightColor : deleteColor
                }
              ],
              numberOfLines: 1,
              adjustsFontSizeToFit: true
            },
            this.props.buttonDeleteText
              ? this.props.buttonDeleteText.toUpperCase()
              : textDeleteAllButtonDefault.toUpperCase()
          )
        )
      );
    };

    this.renderTitle = (colorTitle, opacityTitle, attemptFailed, showError) => {
      return React.createElement(
        react_native_1.Text,
        {
          style: [
            this.props.styleTextTitle ? this.props.styleTextTitle : styles.textTitle,
            { color: colorTitle, opacity: opacityTitle }
          ]
        },
        (attemptFailed && this.props.titleAttemptFailed) ||
          (showError && this.props.titleConfirmFailed) ||
          (showError && this.props.titleValidationFailed) ||
          this.props.sentenceTitle
      );
    };
    this.renderSubtitle = (colorTitle, opacityTitle, attemptFailed, showError) => {
      return React.createElement(
        react_native_1.Text,
        {
          style: [
            this.props.styleTextSubtitle ? this.props.styleTextSubtitle : styles.textSubtitle,
            { color: colorTitle, opacity: opacityTitle }
          ]
        },
        attemptFailed || showError ? this.props.subtitleError : this.props.subtitle
      );
    };
    this.state = {
      password: '',
      showError: false,
      textButtonSelected: '',
      colorDeleteButton: this.props.styleDeleteButtonColorHideUnderlay
        ? this.props.styleDeleteButtonColorHideUnderlay
        : '#d3d3d3',
      colorDeleteAllText: this.props.styleDeleteButtonColorHideUnderlay
        ? this.props.styleDeleteButtonColorHideUnderlay
        : '#d3d3d3',
      currentButtonPressed: undefined,
      attemptFailed: false,
      changeScreen: false
    };
    this._circleSizeEmpty = this.props.styleCircleSizeEmpty || 6;
    this._circleSizeFull = this.props.styleCircleSizeFull || (this.props.pinCodeVisible ? 9 : 12);
    this.renderButtonNumber = this.renderButtonNumber.bind(this);
    this.renderCirclePassword = this.renderCirclePassword.bind(this);
    this.doShake = this.doShake.bind(this);
    this.showError = this.showError.bind(this);
    this.endProcess = this.endProcess.bind(this);
    this.failedAttempt = this.failedAttempt.bind(this);
    this.newAttempt = this.newAttempt.bind(this);
    this.renderButtonDelete = this.renderButtonDelete.bind(this);
    this.renderButtonDeleteAll = this.renderButtonDeleteAll.bind(this);
    this.onPressButtonNumber = this.onPressButtonNumber.bind(this);
    this.renderTitle = this.renderTitle.bind(this);
  }
  componentDidMount() {
    if (this.props.getCurrentLength) this.props.getCurrentLength(0);
  }
  componentWillUpdate(nextProps) {
    if (this.props.pinCodeStatus !== 'failure' && nextProps.pinCodeStatus === 'failure') {
      this.failedAttempt();
    }
    if (this.props.pinCodeStatus !== 'locked' && nextProps.pinCodeStatus === 'locked') {
      this.setState({ password: '' });
    }
  }
  async doShake() {
    const duration = 70;
    react_native_1.Vibration.vibrate(500, false);
    if (this.props.getCurrentLength) this.props.getCurrentLength(0);
  }
  async showError(isErrorValidation = false) {
    this.setState({ changeScreen: true });
    await delay_1.default(300);
    this.setState({ showError: true, changeScreen: false });
    this.doShake();
    await delay_1.default(3000);
    this.setState({ changeScreen: true });
    await delay_1.default(200);
    this.setState({ showError: false });
    await delay_1.default(200);
    this.props.endProcess(this.state.password, isErrorValidation);
    if (isErrorValidation) this.setState({ changeScreen: false });
  }
  async showConfirmError() {
    this.setState({ changeScreen: true });
    await delay_1.default(300);
    this.setState({ showError: true, changeScreen: false });
    this.doShake();
    await delay_1.default(3000);
    this.setState({ showError: false });
    await delay_1.default(100);
    this.props.endProcess(this.state.password);
  }
  render() {
    const { password, showError, attemptFailed, changeScreen } = this.state;
    return React.createElement(
      react_native_1.View,
      {
        style: this.props.styleContainer ? this.props.styleContainer : styles.container
      },
      React.createElement(
        Animate_1.default,
        {
          show: true,
          start: {
            opacity: 0,
            colorTitle: this.props.styleColorTitle
              ? this.props.styleColorTitle
              : colors_1.colors.grey,
            colorSubtitle: this.props.styleColorSubtitle
              ? this.props.styleColorSubtitle
              : colors_1.colors.grey,
            opacityTitle: 1
          },
          enter: {
            opacity: [1],
            colorTitle: [
              this.props.styleColorTitle ? this.props.styleColorTitle : colors_1.colors.grey
            ],
            colorSubtitle: [
              this.props.styleColorSubtitle ? this.props.styleColorSubtitle : colors_1.colors.grey
            ],
            opacityTitle: [1],
            timing: { duration: 100, ease: d3_ease_1.easeLinear }
          },
          update: {
            opacity: [changeScreen ? 0 : 1],
            colorTitle: [
              showError || attemptFailed
                ? this.props.styleColorTitleError
                  ? this.props.styleColorTitleError
                  : colors_1.colors.alert
                : this.props.styleColorTitle
                  ? this.props.styleColorTitle
                  : colors_1.colors.grey
            ],
            colorSubtitle: [
              showError || attemptFailed
                ? this.props.styleColorSubtitleError
                  ? this.props.styleColorSubtitleError
                  : colors_1.colors.alert
                : this.props.styleColorSubtitle
                  ? this.props.styleColorSubtitle
                  : colors_1.colors.grey
            ],
            opacityTitle: [showError || attemptFailed ? grid_1.grid.highOpacity : 1],
            timing: { duration: 200, ease: d3_ease_1.easeLinear }
          }
        },
        ({ opacity, colorTitle, colorSubtitle, opacityTitle }) =>
          React.createElement(
            react_native_1.View,
            {
              style: [
                this.props.styleViewTitle ? this.props.styleViewTitle : styles.viewTitle,
                { opacity: opacity }
              ]
            },
            this.props.titleComponent
              ? this.props.titleComponent()
              : this.renderTitle(colorTitle, opacityTitle, attemptFailed, showError),
            this.props.subtitleComponent
              ? this.props.subtitleComponent()
              : this.renderSubtitle(colorSubtitle, opacityTitle, attemptFailed, showError)
          )
      ),
      React.createElement(
        react_native_1.View,
        { style: styles.flexCirclePassword },
        this.props.passwordComponent ? this.props.passwordComponent() : this.renderCirclePassword()
      ),
      this.props.status === PinStatus.enter &&
        this.props.titleLogin !== '' &&
        React.createElement(
          react_native_1.View,
          { style: {} },
          React.createElement(
            react_native_1.Text,
            { style: styles.textTitleLogin },
            this.props.titleLogin
          )
        ),
      React.createElement(
        react_native_easy_grid_1.Grid,
        { style: styles.grid },
        React.createElement(
          react_native_easy_grid_1.Row,
          {
            style: this.props.styleRowButtons ? this.props.styleRowButtons : styles.row
          },
          _.range(1, 4).map(i => {
            return React.createElement(
              react_native_easy_grid_1.Col,
              {
                key: i,
                style: this.props.styleColumnButtons
                  ? this.props.styleColumnButtons
                  : styles.colButtonCircle
              },
              this.props.buttonNumberComponent
                ? this.props.buttonNumberComponent(i, this.onPressButtonNumber)
                : this.renderButtonNumber(i.toString())
            );
          })
        ),
        React.createElement(
          react_native_easy_grid_1.Row,
          {
            style: this.props.styleRowButtons ? this.props.styleRowButtons : styles.row
          },
          _.range(4, 7).map(i => {
            return React.createElement(
              react_native_easy_grid_1.Col,
              {
                key: i,
                style: this.props.styleColumnButtons
                  ? this.props.styleColumnButtons
                  : styles.colButtonCircle
              },
              this.props.buttonNumberComponent
                ? this.props.buttonNumberComponent(i, this.onPressButtonNumber)
                : this.renderButtonNumber(i.toString())
            );
          })
        ),
        React.createElement(
          react_native_easy_grid_1.Row,
          {
            style: this.props.styleRowButtons ? this.props.styleRowButtons : styles.row
          },
          _.range(7, 10).map(i => {
            return React.createElement(
              react_native_easy_grid_1.Col,
              {
                key: i,
                style: this.props.styleColumnButtons
                  ? this.props.styleColumnButtons
                  : styles.colButtonCircle
              },
              this.props.buttonNumberComponent
                ? this.props.buttonNumberComponent(i, this.onPressButtonNumber)
                : this.renderButtonNumber(i.toString())
            );
          })
        ),
        React.createElement(
          react_native_easy_grid_1.Row,
          {
            style: this.props.styleRowButtons ? this.props.styleRowButtons : styles.row
          },
          React.createElement(
            react_native_easy_grid_1.Col,
            {
              style: this.props.styleColumnButtons
                ? this.props.styleColumnButtons
                : styles.colButtonCircle
            },
            React.createElement(
              Animate_1.default,
              {
                show: true,
                start: {
                  opacity: 0.5
                },
                update: {
                  opacity: [
                    password.length === 0 || password.length === this.props.passwordLength ? 0.5 : 1
                  ],
                  timing: { duration: 100, ease: d3_ease_1.easeLinear }
                }
              },
              ({ opacity }) =>
                this.props.buttonDeleteAllComponent
                  ? this.props.buttonDeleteAllComponent(() => {
                      if (this.state.password.length > 0) {
                        this.setState({ password: '' });
                        if (this.props.getCurrentLength) this.props.getCurrentLength(0);
                      }
                    })
                  : this.renderButtonDeleteAll(opacity)
            )
          ),
          React.createElement(
            react_native_easy_grid_1.Col,
            {
              style: this.props.styleColumnButtons
                ? this.props.styleColumnButtons
                : styles.colButtonCircle
            },
            this.props.buttonNumberComponent
              ? this.props.buttonNumberComponent('0', this.onPressButtonNumber)
              : this.renderButtonNumber('0')
          ),
          React.createElement(
            react_native_easy_grid_1.Col,
            {
              style: this.props.styleColumnButtons
                ? this.props.styleColumnButtons
                : styles.colButtonCircle
            },
            React.createElement(
              Animate_1.default,
              {
                show: true,
                start: {
                  opacity: 0.5
                },
                update: {
                  opacity: [
                    password.length === 0 || password.length === this.props.passwordLength ? 0.5 : 1
                  ],
                  timing: { duration: 100, ease: d3_ease_1.easeLinear }
                }
              },
              ({ opacity }) =>
                this.props.buttonDeleteComponent
                  ? this.props.buttonDeleteComponent(() => {
                      if (this.state.password.length > 0) {
                        const newPass = this.state.password.slice(0, -1);
                        this.setState({ password: newPass });
                        if (this.props.getCurrentLength)
                          this.props.getCurrentLength(newPass.length);
                      }
                    })
                  : this.renderButtonDelete(opacity)
            )
          )
        )
      )
    );
  }
}
exports.default = PinCode;
let styles = react_native_1.StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  viewTitle: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flex: 2
  },
  row: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: grid_1.grid.unit * 5.5,
    backgroundColor: 'transparent'
  },
  colButtonCircle: {
    marginLeft: grid_1.grid.unit / 2,
    marginRight: grid_1.grid.unit / 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: grid_1.grid.unit * 2,
    width: grid_1.grid.unit * 4,
    height: grid_1.grid.unit * 4
  },
  colEmpty: {
    marginLeft: grid_1.grid.unit / 2,
    marginRight: grid_1.grid.unit / 2,
    width: grid_1.grid.unit * 4,
    height: grid_1.grid.unit * 4
  },
  colIcon: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: grid_1.grid.unit * 4,
    height: grid_1.grid.unit * 4,
    marginHorizontal: grid_1.grid.unit
  },
  text: {
    fontSize: grid_1.grid.unit * 2,
    fontWeight: '200'
  },
  buttonCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    width: grid_1.grid.unit * 4,
    height: grid_1.grid.unit * 4,
    borderRadius: grid_1.grid.unit * 2,
    borderColor: mainColor,
    borderWidth: 1
  },
  textTitle: {
    fontSize: 20,
    fontWeight: '200',
    lineHeight: grid_1.grid.unit * 2.5
  },
  textSubtitle: {
    fontSize: grid_1.grid.unit,
    fontWeight: '200',
    textAlign: 'center'
  },
  flexCirclePassword: {
    flex: 2,
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  topViewCirclePassword: {
    flexDirection: 'row',
    height: 'auto',
    justifyContent: 'center',
    alignItems: 'center'
  },
  viewCircles: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  textDeleteButton: {
    fontWeight: 'bold',
    marginTop: 5,
    fontSize: 16
  },
  grid: {
    maxWidth: grid_1.grid.unit * 16.25,
    flex: 7
  },
  textTitleLogin: {
    fontSize: 16,
    textDecorationLine: 'underline',
    paddingBottom: 20,
    color: 'orange',
    lineHeight: 19
  }
});
