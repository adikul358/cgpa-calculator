"use client"

// Imports
import React, { useContext, useEffect, useRef, useState } from "react"
import { Typography, Table, InputRef, Button, Form, Input, Select, ConfigProvider, theme } from "antd"
import type { SelectProps } from "antd"
import type { FormInstance } from "antd/es/form"
import { DeleteOutlined, MinusCircleOutlined, PlusCircleOutlined } from "@ant-design/icons"
const { Title, Text } = Typography

// Type declarations
interface DataType {
  key: number
  course: string
  credits: string | number
  grade: string | number
} 
interface EditableRowProps {
  index: number
}
interface EditableCellProps {
  title: React.ReactNode
  editable: boolean
  children: React.ReactNode
  dataIndex: keyof DataType
  record: DataType
  handleSave: (record: DataType) => void
}
type EditableTableProps = Parameters<typeof Table>[0]
type ColumnTypes = Exclude<EditableTableProps["columns"], undefined>


// Context
const EditableContext = React.createContext<FormInstance<any> | null>(null)


// Sub-components
const GradeCell: React.FC<{onChange: SelectProps["onChange"]}> = ({onChange}) => {
  return (
    <Select
      onChange={onChange}
      defaultValue=""
      options={[
        { value: "", label: "Select", disabled: true },
        { value: 10, label: "O (10)" },
        { value: 9, label: "A+ (9)" },
        { value: 8, label: "A (8)" },
        { value: 7, label: "B+ (7)" },
        { value: 6, label: "B (6)" },
        { value: 5, label: "C+ (5)" },
        { value: 0, label: "F (0)" },
      ]}
    />
  )
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm()
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  )
}

const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false)
  const inputRef = useRef<InputRef>(null)
  const form = useContext(EditableContext)!

  useEffect(() => {
    if (editing) {
      inputRef.current!.focus()
    }
  }, [editing])

  const toggleEdit = () => {
    setEditing(!editing)
    form.setFieldsValue({ [dataIndex]: record[dataIndex] })
  }

  const save = async () => {
    try {
      const values = await form.validateFields()
      toggleEdit()
      handleSave({ ...record, ...values })
    } catch (errInfo) {
      console.log("Save failed:", errInfo)
    }
  }

  let childNode = children

  if (editable) {
    if (dataIndex === "credits") {
      childNode = editing ? (
        <Form.Item
          style={{ margin: 0 }}
          name={dataIndex}
          rules={[
            {
              required: true,
              message: `${title} are required.`,
            },
          ]}
        >
          <Input ref={inputRef} onPressEnter={save} onBlur={save} type="number" min={0}  />
        </Form.Item>
      ) : (
        <div className="editable-cell-value-wrap" style={{ paddingRight: 24 }} onClick={toggleEdit}>
          {children}
        </div>
      )
    } else {
      childNode = editing ? (
        <Form.Item
          style={{ margin: 0 }}
          name={dataIndex}
          rules={[
            {
              warningOnly: true,
              required: true,
              message: `${title} is required.`,
            },
          ]}
        >
          <Input ref={inputRef} onPressEnter={save} onBlur={save} />
        </Form.Item>
      ) : (
        <div className="editable-cell-value-wrap" style={{ paddingRight: 24 }} onClick={toggleEdit}>
          {children}
        </div>
      )
    }
  }

  return <td {...restProps}>{childNode}</td>
}

const CGPA: React.FC<{tableData: readonly DataType[]}> = ({tableData}) => {
  const [cgpa, setcgpa] = useState(0)

  useEffect(() => {
    if (tableData.some(v1 => typeof v1.grade !== "number") || tableData.length === 0) {
      setcgpa(0)
    } else { 
      let cgpaN = 0
      let cgpaD = 0
      tableData.map(v => {
        if (typeof v.grade === "number") {
          const credits = typeof v.credits === "string" ? parseInt(v.credits) : v.credits
          cgpaN += credits * v.grade
          cgpaD += credits
          console.log(v.course, credits, v.grade)
          console.log(v.course, cgpaN, cgpaD)
        }
      })
      setcgpa(Math.round(cgpaN / cgpaD * 100) / 100)
    }
  }, [tableData])


  return (
    <Title level={3} style={{marginBottom: 0}}>CGPA: <span className="text-[rgb(64,150,255)]">{cgpa ? cgpa.toFixed(2) : "-"}</span></Title>
  )
}


// Main component
const EditableTable: React.FC = () => {
  const [dataSource, setDataSource] = useState<DataType[]>([
    {
      key: 1,
      course: "Semiconductor Physics and Computational Methods",
      credits: 5,
      grade: "",
    },
    {
      key: 2,
      course: "Electrical and Electronics Engineering",
      credits: 4,
      grade: "",
    },
    {
      key: 3,
      course: "Advanced Calculus and Complex Analysis",
      credits: 4,
      grade: "",
    },
    {
      key: 4,
      course: "Object Oriented Design and Programming",
      credits: 3,
      grade: "",
    },
    {
      key: 5,
      course: "Communicative English",
      credits: 3,
      grade: "",
    },
    {
      key: 6,
      course: "Engineering Graphics and Design",
      credits: 2,
      grade: "",
    },
  ])

  const [count, setCount] = useState(0)

  const updateGrade = (key: React.Key | undefined, grade: number | string) => {
    const newData = [...dataSource]
    newData.map(v => {
      if (v.key == key) { v.grade = grade }
    })
    setDataSource(newData)
  }

  const handleDelete = (key: React.Key | undefined) => {
    const newData = dataSource.filter((item) => item.key !== key)
    setDataSource(newData)
  }

  const defaultColumns: (ColumnTypes[number] & { editable?: boolean, dataIndex: string })[] = [
    {
      title: "Course Name",
      dataIndex: "course",
      editable: true,
    },
    {
      title: "Credits",
      dataIndex: "credits",
      width: "20%",
      editable: true,
    },
    {
      title: "Grade",
      dataIndex: "grade",
      width: "20%",
      render: (_, record: { key?: React.Key }) => <GradeCell onChange={(val) => updateGrade(record.key, val)} />
    },
    {
      title: "",
      dataIndex: "operation",
      width: "64px",
      align: "center",
      render: (_, record: { key?: React.Key }) =>
        dataSource.length >= 1 ? (
          <Button onClick={() => handleDelete(record.key)} icon={<MinusCircleOutlined style={{color: "white"}} />} type="primary" style={{backgroundColor: "rgb(220,38,38)"}} />
        ) : null,
    },
  ]

  const handleAdd = () => {
    const newData: DataType = {
      key: count,
      course: "Enter Name",
      credits: 0,
      grade: "",
    }
    setDataSource([...dataSource, newData])
    setCount(count + 1)
  }

  const handleClear = () => {
    setDataSource([])
    setCount(0)
  }

  const handleSave = (row: DataType) => {
    const newData = [...dataSource]
    const index = newData.findIndex((item) => row.key === item.key)
    const item = newData[index]
    newData.splice(index, 1, {
      ...item,
      ...row,
    })
    setDataSource(newData)
  }

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  }

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col
    }
    return {
      ...col,
      onCell: (record: DataType) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    }
  })

  return (
    <>
    <div className="flex justify-between items-center mb-6 gap-x-3">
      <CGPA tableData={dataSource} />
      <div className="flex gap-x-3">
        <Button onClick={handleClear} type="primary" icon={<DeleteOutlined />} style={{ backgroundColor: "rgb(220,38,38)" }}>
          Clear
        </Button>
        <Button onClick={handleAdd} type="primary" icon={<PlusCircleOutlined />} style={{ backgroundColor: "rgb(22,163,74)" }}>
          Row
        </Button>
      </div>
    </div>
    <div className="w-full overflow-x-scroll">
      <Table
        components={components}
        rowClassName={() => "editable-row"}
        bordered
        dataSource={dataSource}
        columns={columns as ColumnTypes}
        pagination={{position: ["none", "none"]}}
        size="middle"
      />
    </div>
    </>
  )
}


// Page export
export default function Home() {

  // Set dark mode according to system
  const [darkMode, setDarkMode] = useState<boolean>()

  useEffect(() => {
    const darkQuery = window.matchMedia("(prefers-color-scheme: dark)")
    setDarkMode(darkQuery.matches)
    const handleChange = (event: MediaQueryListEvent) => {
      setDarkMode(event.matches)
    }
    darkQuery.addEventListener("change", handleChange)
    return () => window.matchMedia("(prefers-color-scheme: dark)").removeEventListener("change", handleChange)
  }, [])

  const { defaultAlgorithm, darkAlgorithm } = theme
  const appTheme = {
    algorithm: darkMode ? darkAlgorithm : defaultAlgorithm
  }


  return (
    <main className={`min-h-screen flex flex-col ${darkMode ? "bg-black" : "bg-white"}`}>
      <header className="bg-primary-700 py-12">
        <div className="page-width">
          <Title style={{color: "rgba(255,255,255,.95)"}}>CGPA Calculator</Title>
          <Text style={{color: "rgba(255,255,255,.95)"}}>Calculate your 10-point CGPA using this tool</Text>
        </div>
      </header>

      <div className="page-width py-12">
        <ConfigProvider theme={appTheme}>
          <EditableTable />
        </ConfigProvider>
      </div>

    </main>
  )
}
