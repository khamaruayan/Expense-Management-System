import React, {useState ,useEffect} from 'react'
import { Form, Input, Modal, Select, Table, message, DatePicker } from 'antd';
import {UnorderedListOutlined, AreaChartOutlined, EditOutlined, DeleteOutlined} from '@ant-design/icons'
import Layout from '../components/Layout/Layout'
import axios from 'axios'
import Spinner from '../components/Spinner'

import moment from 'moment';
import Analytics from '../components/Analytics';
const {RangePicker} = DatePicker;

const HomePage=()=>{
    const[showModal, setShowModal]=useState(false)
    const[loading, setLoading]=useState(false)
    const[allTransection, setAllTransection]=useState([])
    const[frequency, setFrequency]=useState('7')
    const[selectedDate, setselectedDate]=useState([])
    const [type, setType]=useState('all')
    const [viewData, setViewData]=useState('table')
    const [editable, setEditable]=useState(null);
    //table data
    const colums=[
        {
            title:'Date',
            dataIndex:'data',
            render:(text)=> <span>{moment(text).format('YYYY-MM-DD')}</span>
        },
        {
            title:'Amount',
            dataIndex:'amount'
        },
        {
            title:'Type',
            dataIndex:'type'
        },
        {
            title:'Category',
            dataIndex:'category'
        },
        {
            title:'Refrence',
            dataIndex:'refrence'
        },
        {
            title:'Actions',
            renedr:(text, record)=>{
                <div>
                    <EditOutlined onClick={()=>{
                        setEditable(record)
                        setShowModal(true)
                    }}/>
                    <DeleteOutlined className='mx-2' onClick={()=>{handleDelete(record)}}/>
                </div>
            }
        },
    ]

    //getall transections
    
    //useeffect
    useEffect(()=>{
        const getAllTransection=async ()=>{
            try {
                const user=JSON.parse(localStorage.getItem('user'))
                setLoading(true)
                const res=await axios.post('api/vi/transections/get-transections', {userid: user._id, frequency, selectedDate,
                    type

                })
                setLoading(false)
                setAllTransection(res.data)
                console.log(res.data)
    
            } catch (error) {
                message.error('Fetch issue with transection');
                
            }
        }
        getAllTransection();
    }, [frequency ,selectedDate, type,setFrequency, viewData]);

    //delete handling
    const handleDelete=async(record)=>{
        try {
            setLoading(true)
             await axios.post('api/vi/transections/delete-transections', {transactionId:record._id})
             setLoading(false)
             message.success("Transaction Deleted!");
            
        } catch (error) {
            setLoading(false)
            console.log(error)
            message.error('Unable to delete')
            
        }

    }
    //form handling
    const handleSubmit= async(values)=>{
        try {
            const user=JSON.parse(localStorage.getItem('user'))
            setLoading(true)
            if(editable){
                await axios.post("api/vi/transections/edit-transection", {
                   payload:{
                    ...values,
                    userid: user._id,
                   },
                   transactionId:editable._id
                });
                setLoading(false);
                message.success("Transaction Updated Successfully");

            }else{
                await axios.post("api/vi/transections/add-transection", {
                    ...values,
                    userid: user._id,
                });
                setLoading(false);
                message.success("Transaction Added Successfully");

            }
            setShowModal(false)
            setEditable(null);
            
        } catch (error) {
            setLoading(false)
            message.error("Failed to add transection");
            
        }

    }
    return(
        <Layout >
            {loading && <Spinner />}
            <div className='filters'>
                <div>
                    <h6>Select Type</h6>
                    <Select value={type} onChange={(values)=> setType(values)}>
                        <Select.Option value="all">ALL</Select.Option>
                        <Select.Option value="income">INCOME</Select.Option>
                        <Select.Option value="expense">EXPENSE</Select.Option>
                        
                    </Select>
                    {frequency==='custom' && <RangePicker value={selectedDate} onChange={(values)=> setselectedDate}/>}
                </div>
                <div className='switch-icon'>
                    <UnorderedListOutlined className={`mx-2 ${viewData==='table' ? 'active-icon': 'inactive-icon'}`}onClick={()=>setViewData('table')}/>
                    <AreaChartOutlined className={`mx-2 ${viewData==='analytics' ? 'active-icon': 'inactive-icon'}`} onClick={()=>setViewData('analytics')}/>

                </div>
                    <button className='btn btn-primary' onClick={()=> setShowModal(true)}>Add New</button>
                </div>
                <div>
                

            </div>
            <div className='content'>
                {viewData ==='table' ? 
                <Table columns={colums} dataSource={allTransection} />
                :<Analytics allTransection={allTransection}/>
                }
                
            </div>
            <Modal title={editable ? 'Edit transaction' : 'Add transaction'}
            open={showModal}
            onCancel={()=> setShowModal(false)} footer={false}>
                <Form layout='vertical' onFinish={handleSubmit} initialValues={editable}>
                    <Form.Item label='Amount' name='amount'>
                        <Input type='text'/>

                    </Form.Item>
                    <Form.Item label='type' name='type'>
                        <Select>
                            <Select.Option value='income'>Income</Select.Option>
                            <Select.Option value='expense'>Expense</Select.Option>
                        </Select>

                    </Form.Item>
                    <Form.Item label='category' name='category'>
                        <Select>
                            <Select.Option value='salary'>Salary</Select.Option>
                            <Select.Option value='tip'>Tip</Select.Option>
                            <Select.Option value='project'>Project</Select.Option>
                            <Select.Option value='food'>Food</Select.Option>
                            <Select.Option value='bills'>Bills</Select.Option>
                            <Select.Option value='medical'>Medical</Select.Option>
                            <Select.Option value='fee'>Fee</Select.Option>
                            <Select.Option value='tax'>Tax</Select.Option>
                            


                        </Select>

                    </Form.Item>
                    <Form.Item label='Date' nmae='date'>
                        <Input type="date"/>
                    </Form.Item>
                    <Form.Item label='Refrence' nmae='refren'>
                        <Input type="text"/>
                    </Form.Item>
                    <Form.Item label='Description' nmae='description'>
                        <Input type="text"/>
                    </Form.Item>
                    <div className='d-flex justify-content-end'>
                        <button  type='submit'className='btn btn-primary'>
                            {" "}
                            SAVE
                            </button>
                    </div>


                </Form>

            </Modal>

        </Layout>
    )
}
export default HomePage