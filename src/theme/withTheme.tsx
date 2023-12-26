import React from "react"
import { ConfigProvider } from "antd"
import theme from "./themeConfig"

const withTheme = (node: React.ReactNode) => {
	return (
		<>
			<ConfigProvider theme={theme}>{node}</ConfigProvider>
		</>
	)
}

export default withTheme