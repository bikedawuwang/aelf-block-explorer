import React, { PureComponent } from "react";
import { Menu } from "antd";
import { Link } from "react-router-dom";

import "./header.styles.less";
import Search from "./../Search/Search";

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

export default class BrowserHeader extends PureComponent {

    constructor() {
        super();
        this.timerInterval = null;
        this.interval = 300;
        this.showSearchTop = 330;
        this.state = {
            showSearch: this.getSearchStatus(),
            showMobileMenu: false,
            current: location.pathname === '/' ? "/home" : location.pathname,
        };
    }

    getSearchStatus() {
        const pathname = location.pathname;
        let showSearch = false;
        if (pathname === '/' && document.body.offsetWidth > 768) {
            const scrollTop = document.documentElement.scrollTop;
            if (scrollTop >= this.showSearchTop) {
                showSearch = true;
            } else {
                showSearch = false;
            }
        } else {
            showSearch = true;
        }
        return showSearch;
    }

    // TODO: 有空的话，回头使用观察者重写一遍，所有跳转都触发Header检测。而不是这种循环。
    setSeleted() {
        this.timerInterval = setInterval(() => {
            let pathname = '/' + location.pathname.split('/')[1];
            pathname = pathname === '/' ? "/home" : pathname;
            if (this.state.current !== pathname) {
                // white list
                const whiteList = ['/block', '/address'];
                if (whiteList.indexOf(pathname) > -1) {
                    pathname = '/blocks';
                }

                const showSearch = this.getSearchStatus();

                this.setState({
                    current: pathname,
                    showSearch
                });
            }
        }, this.interval);
    }

    componentDidMount() {
        this.setSeleted();
        window.addEventListener('scroll', this.handleScroll.bind(this));
    }

    componentWillUnmount() {
        clearInterval(this.timerInterval);
        window.removeEventListener('scroll', this.handleScroll);
    }

    handleScroll() {
        if (location.pathname === '/') {
            const showSearch = this.getSearchStatus();

            if (showSearch !== this.state.showSearch) {
                this.setState({
                    showSearch: showSearch
                });
            }
        }
    }

    // handleClick = e => {
    //     clearTimeout(this.timerTimeout);
    //     this.timerTimeout = setTimeout(() => {
    //         this.setState({
    //             current: e.key
    //         });
    //     }, this.interval);
    // };

    renderMenu(menuMode, showMenu = true) {

        const menuClass = showMenu ? 'aelf-menu' : 'aelf-menu  aelf-menu-hidden';

        return (
            <Menu
                // onClick={this.handleClick}
                selectedKeys={[this.state.current]}
                mode={menuMode}
                key="navbar"
                className={menuClass}
            >
                <Menu.Item key="/home">
                    {/*<Icon type="home" />*/}
                    <Link to="/">HOME</Link>
                </Menu.Item>
                <SubMenu
                    title={
                        <span className="submenu-title-wrapper">
                            {/*<Icon type="gold" />*/}
                            BLOCKCHAIN
                        </span>
                    }
                    className="aelf-submenu-container"
                >
                    <MenuItemGroup title="Block">
                        <Menu.Item key="/blocks">
                            {/*<Icon type="gold" />*/}
                            <Link to="/blocks">View Blocks</Link>
                        </Menu.Item>
                    </MenuItemGroup>
                    <MenuItemGroup title="Transaction">
                        <Menu.Item key="/txs">
                            {/*<Icon type="pay-circle" />*/}
                            <Link to="/txs">View Transactions</Link>
                        </Menu.Item>
                    </MenuItemGroup>
                </SubMenu>
                <Menu.Item key="/wallet">
                    {/*<Icon type="wallet" />*/}
                    <a
                        href="https://wallet-test.aelf.io/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        WALLET
                    </a>
                </Menu.Item>
                <Menu.Item key="/apps">
                    {/*<Icon type="appstore" />*/}
                    {/*<Link to="/apps">APP CENTER[Building]</Link>*/}
                    <span>APP CENTER [Building]</span>
                </Menu.Item>
                <Menu.Item key="/about">
                    {/*<Icon type="profile" />*/}
                    <a
                        href="https://www.aelf.io/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        ABOUT
                    </a>
                </Menu.Item>
            </Menu>
        );
    }

    toggleMenu() {
        this.setState({
            showMobileMenu: !this.state.showMobileMenu
        });
    }

    renderMobileMore() {
        return (
            <div
                className="header-navbar-mobile-more"
                onClick={() => this.toggleMenu()}
            >...</div>
        );
    }


    render() {
        const screenWidth = document.body.offsetWidth;
        const isSmallScreen = screenWidth <= 768;
        const menuMode = isSmallScreen ? 'inline' : 'horizontal';

        const mobileMoreHTML = isSmallScreen ? this.renderMobileMore() : '';

        let menuHtml;
        if (isSmallScreen) {
            menuHtml = this.renderMenu(menuMode, this.state.showMobileMenu);
        } else {
            menuHtml = this.renderMenu(menuMode);
        }

        return (
            <div className="header-fixed-contaier">
                <div className="header-container">
                    <Link to="/" key="logo">
                        <img src="https://aelf.io/assets/images/logo.jpg" />
                    </Link>

                    {mobileMoreHTML}

                    <nav className="header-navbar">
                        {menuHtml}
                        {this.state.showSearch && <Search />}
                    </nav>
                </div>
            </div>

        );
    }
}
