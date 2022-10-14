import React, { useEffect, useRef, useState } from "react";
import { useNavigate,useParams,useLocation  } from 'react-router-dom';
import { Button, PageHeader,Steps,Form,Input,Select, message,notification } from 'antd';
import style from './news.module.css'
import axios from "axios";
import NewsEditor from "../../../components/news-manage/NewsEditor";

const { Step } = Steps;
const { Option } = Select;

export default function NewsAdd() {

    const navigate = useNavigate()
    const [title,setTitle] = useState("撰写新闻")
    const [current,setCurrent] = useState(0)  // 当前的步骤
    const [categoryList,setCategoryList] = useState([])  // 新闻分类
    const NewsForm = useRef(null)

    const [formInfo,setFormInfo] = useState({})
    const [content,setContent] = useState("")
    const User = JSON.parse(localStorage.getItem('token'))

    const {id} = useParams()
    const {state} = useLocation()
    // const [updateFormInfo,setUpdateFormInfo] = useState({})

    useEffect(() => {
        axios.get('/categories').then(res => {
            console.log(res);
            setCategoryList(res.data)
        })
    },[])

    // 是从点击草稿箱跳转来的
    useEffect(()=> {
        if (id) {
            setTitle('更新新闻')
            let {title, categoryId,content} = state.row
            NewsForm.current.setFieldsValue({
                title,categoryId
            })

           setContent(content)
        }else{
            setTitle('撰写新闻')
            NewsForm.current.setFieldsValue({
                title:'',categoryId:''
              })
              setContent(null)
        }
    },[id,state])

    //下一步
    const handleNext = () => {
        if (current === 0) {
            NewsForm.current.validateFields().then(res => {
                setFormInfo(res) //把输入的值存起来
                setCurrent(current+1)
            })   
        }else {
            if (content === '' || content.trim() ==='<p></p>') {
                message.error('新闻内容不能为空')            
            }else{
                setCurrent(current+1)
            }
        }
    }

    // 上一步
    const handlePrevious = () => {
        setCurrent(current-1)
    }

    // 提交审核
    const handleSubmit = (auditState) => {

        // 如果存在id就是更新patch，否则是添加post
        (id?axios.patch(`/news/${id}`,{
            ...formInfo,
            "content":content,
            "auditState":auditState,
        }):axios.post('/news',{
            ...formInfo,
            "content":content,
            "region":User.region?User.region:'全球',
            "author":User.username,
            "roleId":User.roleId,
            "auditState":auditState,
            "publishState":0,
            "createTime": Date.now(),
            "star":0,
            "view":0,
            // "publishTime":0
        })).then(res=> {
            navigate(auditState===0?'/news-manage/draft':'/audit-manage/list')

            notification.info({
                message: `通知 `,
                description:`您可以到${auditState===0?'草稿箱':'审核列表'}中查看您的新闻`,placement:'bottomRight'
              });
        })
    }
    return (
        <div>
            {/* {
              id && <Button type="text" onClick={()=>window.history.back()}>返回</Button>
            } */}
             <PageHeader
                className="site-page-header"
                title={title}
                onBack={() => id?window.history.back():null}
            />
             <Steps current={current}>
                <Step title="基本信息" description="新闻标题，新闻分类" />
                <Step title="新闻内容" description="新闻主体内容" />
                <Step title="新闻提交" description="保存草稿或者提交审核" />
            </Steps>
            <div className={current===0?'':style.isActive} style={{marginTop:'50px'}}>
                <Form
                    wrapperCol={{
                    span: 24,
                    }}
                    name="basic"
                    ref={NewsForm}
                    >
                    <Form.Item
                        label="新闻标题"
                        name="title"
                        rules={[
                        {
                            required: true,
                            message: 'Please input your username!',
                        },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="新闻分类"
                        name="categoryId"
                        rules={[
                        {
                            required: true,
                            message: 'Please input your username!',
                        },
                        ]}
                    >
                        <Select>
                            {
                                categoryList.map(item => {
                                    return <Option value={item.id} key={item.id}>{item.title}</Option>
                                })
                            }
                        </Select>
                    </Form.Item>
                </Form>
            </div>
            <div className={current===1?'':style.isActive}>
                <NewsEditor getContent={(value) =>{
                    console.log(value);
                    setContent(value)
                }} content={content}></NewsEditor>
            </div>
            <div className={current===2?'':style.isActive}></div>
            <div style={{marginTop:'50px'}}>
                {
                    current === 2 && <span>
                        <Button type="primary" onClick={() => handleSubmit(0)}>保存草稿箱</Button>
                        <Button danger onClick={() => handleSubmit(1)}>提交审核</Button>
                    </span>
                }
                {
                    current < 2 && <Button type="primary" onClick={() => handleNext()}>下一步</Button>
                }
                {
                   current > 0 && <Button onClick={() => handlePrevious()}>上一步</Button>
                }
            </div>
        </div>
    )
}