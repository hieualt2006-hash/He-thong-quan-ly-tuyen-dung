const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- Seeding canonical jobs ---');

  // Delete all existing applications and jobs first to have clean synchronization
  await prisma.question.deleteMany({});
  await prisma.application.deleteMany({});
  await prisma.job.deleteMany({});

  const job1 = await prisma.job.create({
    data: {
      id: 'job-1',
      title: 'Chief Executive Officer',
      department: 'Management',
      salaryRange: '$3,000 - $5,000',
      description: 'Điều hành chiến lược toàn diện của công ty.',
      requirements: '10+ năm kinh nghiệm quản trị cấp cao.',
      status: 'Open',
      toRecruit: 1,
      email: 'ceo@nhom20.com'
    }
  });

  const job2 = await prisma.job.create({
    data: {
      id: 'job-2',
      title: 'Consultant',
      department: 'Management',
      salaryRange: '$1,500 - $2,500',
      description: 'Tư vấn giải pháp chuyển đổi số và quản trị doanh nghiệp.',
      requirements: 'Kỹ năng giao tiếp và thuyết trình xuất sắc.',
      status: 'Open',
      toRecruit: 5,
      email: 'consultant@nhom20.com'
    }
  });

  const job3 = await prisma.job.create({
    data: {
      id: 'job-3',
      title: 'Experienced Developer',
      department: 'Research & Development',
      salaryRange: '$1,800 - $3,000',
      description: 'Phát triển các module hệ thống ERP và tích hợp AI.',
      requirements: 'React, Node.js, PostgreSQL/SQLite, AI integration.',
      status: 'Open',
      toRecruit: 5,
      email: 'dev@nhom20.com'
    }
  });

  const job4 = await prisma.job.create({
    data: {
      id: 'job-4',
      title: 'chạy bộ',
      department: 'Research & Development',
      salaryRange: 'Thỏa thuận',
      description: 'Vận động viên rèn luyện sức khỏe thể chất công ty.',
      requirements: 'Tinh thần thể thao và dẻo dai.',
      status: 'Open',
      toRecruit: 1,
      email: 'cb@nhom20.com'
    }
  });

  // Sample candidates & applications
  let cand1 = await prisma.candidate.findFirst({ where: { email: 'hoang.tran@gmail.com' } });
  if (!cand1) {
    cand1 = await prisma.candidate.create({
      data: {
        fullName: 'Trần Văn Hoàng',
        email: 'hoang.tran@gmail.com',
        phone: '0987654321',
        rawCvText: 'Fullstack developer with 4 years experience in Node.js, Express, PostgreSQL, React and Docker.'
      }
    });
  }

  let cand2 = await prisma.candidate.findFirst({ where: { email: 'quan.le@gmail.com' } });
  if (!cand2) {
    cand2 = await prisma.candidate.create({
      data: {
        fullName: 'Lê Minh Quân',
        email: 'quan.le@gmail.com',
        phone: '0912345678',
        rawCvText: 'AI Researcher & Engineer specializing in LLMs, LangChain, RAG architecture and Vector DBs.'
      }
    });
  }

  let cand3 = await prisma.candidate.findFirst({ where: { email: 'dung.nguyen@yahoo.com' } });
  if (!cand3) {
    cand3 = await prisma.candidate.create({
      data: {
        fullName: 'Nguyễn Thuỳ Dung',
        email: 'dung.nguyen@yahoo.com',
        phone: '0933445566',
        rawCvText: 'Business Consultant with 5 years experience in enterprise IT transformation and CRM systems.'
      }
    });
  }

  await prisma.application.create({
    data: {
      id: 'app-1',
      jobId: job3.id, // Experienced Developer
      candidateId: cand1.id,
      status: 'Applied',
      matchScore: 92,
      matchSummary: 'Ứng viên có kỹ năng Node.js, Express, Docker và React rất phù hợp với vị trí Experienced Developer.',
      missingSkills: 'Redis, Kubernetes'
    }
  });

  await prisma.application.create({
    data: {
      id: 'app-2',
      jobId: job3.id, // Experienced Developer
      candidateId: cand2.id,
      status: 'Applied',
      matchScore: 88,
      matchSummary: 'Ứng viên có kỹ năng AI và Backend tốt.',
      missingSkills: 'Hệ thống ERP'
    }
  });

  await prisma.application.create({
    data: {
      id: 'app-3',
      jobId: job2.id, // Consultant
      candidateId: cand3.id,
      status: 'Applied',
      matchScore: 85,
      matchSummary: 'Kinh nghiệm tư vấn chuyển đổi số doanh nghiệp phong phú.',
      missingSkills: 'Tiếng Anh chuyên ngành'
    }
  });

  console.log('✅ Successfully seeded canonical jobs and applications:');
  const allJobs = await prisma.job.findMany({ select: { id: true, title: true, email: true } });
  console.log(allJobs);
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
